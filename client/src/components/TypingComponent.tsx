import React from 'react'
import { useEffect,useState } from 'react';
import { Button } from 'react-bootstrap';
import "firebase/database";
import "firebase/auth"
import { User } from "firebase/auth";
import { useUserAuth } from '@/context/UserAuthContext';
import { Navigate,useNavigate } from 'react-router-dom';

import { getDatabase, ref, push, onValue } from 'firebase/database';
import app from '@/firebase';
import Navbar from './Navbar';
import { useSocket } from './socketContext';

interface FirebaseData {
  [key: string]: {
    date: string; 
    wpm: number;
  }; 
}

interface TypingProps {
  Para: string;
  Multiplayer: boolean;
  Index: number
}


const TypingComponent: React.FC<TypingProps> = ({ Para, Multiplayer, Index}) => {
  const length: number = Para.length;
  const socket = useSocket();

  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(false);
  const [wpmResult, setWpmResult] = useState<number | null>(null);
  const [timeResult, setTimeResult] = useState<number | null>(null);
  const [opponentScores, setOpponentScores] = useState<{ userId: string; wpm: number; accuracy: number }[]>([]);
  

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  
  

  
  useEffect(() => {

    if (!socket) {
      
      console.error('Socket is not available');
      return;
    }

    socket.on('opponentScores', (scores: { userId: string; wpm: number; accuracy: number }[]) => {
      setOpponentScores(scores);
    });
    const database = getDatabase(app);
    const userRef = ref(database, `users/${user?.uid}/tests`);
    

    
  
    let input = document.getElementById('typeValue') as HTMLElement;
    let resetBtn = document.querySelector('.reset_button') as HTMLElement;
    let type_content = document.querySelector('.type_content p') as HTMLElement;
    let letterIndex =0;
    let mistakes=0
    let isTyping =false;
    let time :number;
    
    
    let t_left = document.querySelector('.t_left') as HTMLElement;
    let error = document.querySelector('.error') as HTMLElement;
    let wpm  = document.querySelector('.wpm') as HTMLElement;
    let maxTime=5;
    let timeSpent=0;
    
   
    const saveUserData = (userId: string, date: string, wpm: number, accuracy: number) => {
      console.log('Saving user data:', userId, date, wpm, accuracy);
      if (!userId) return;

      const userRef = ref(database, `users/${userId}/tests`);
      push(userRef, {
        date,
        wpm,
        accuracy,
      });
    };

    
    const loadPara = () => {
          
          
          Para.split('').forEach(element=>{
            let realData = `<span>${element}</span>`;
            type_content.innerHTML+=realData;
          })
          document.addEventListener('click', ()=>{
            input.focus();
          })
          type_content.addEventListener('click', ()=>{
            input.focus();
          })
          console.log(Para);
   }
  loadPara();

  


  input.addEventListener('input', (e: Event) => {
    const target = e.target as HTMLInputElement;
    const char = type_content.querySelectorAll('span');
    const inputValue = target.value.charAt(letterIndex); 
  
    if (!isTyping) {
      time = window.setInterval(timeSetup, 1000);
      isTyping = true;
    }
    
    if (letterIndex < char.length) {
      if (inputValue === null) {//backspace
        if (letterIndex > 0) {
          letterIndex--;
          if (char[letterIndex].classList.contains('incorrect')) {
            mistakes--;
          }
          char[letterIndex].classList.remove('correct', 'incorrect');
        }
      } else {
        if (char[letterIndex].innerText === inputValue) {
          
          char[letterIndex].classList.add('correct');
          if(Multiplayer && Index>0){
            char[Index-1].classList.add('opponent');
          }
        } else {
          char[letterIndex].classList.add('incorrect');
          
          mistakes++;
        }
        letterIndex++;
      }
    }
  });
  let wpmTab:number;
  let accuracyTab:number;

  const timeSetup = () =>{
    if(letterIndex<length){
      timeSpent++;
      t_left.innerText = `Time :${timeSpent}S`
      wpmTab = Math.round((letterIndex-mistakes)/5/(timeSpent)*60);
      accuracyTab=Math.round(((letterIndex-mistakes)/letterIndex)*100)
      wpm.innerText= `WPM : ${wpmTab}`;
      error.innerText = `Accuracy: ${accuracyTab} `;
    }
    
    else {
      setWpmResult(wpmTab);
      setTimeResult(timeSpent);
      setCompleted(true);
      socket.emit('testCompleted', { userId: user?.uid, wpm: wpmTab, accuracy: accuracyTab });
      const practiceElements: HTMLCollectionOf<Element> = document.getElementsByClassName('practice');
      for (let i = 0; i < practiceElements.length; i++) {
      const element = practiceElements[i] as HTMLElement;
      element.innerHTML = '';            
      }
      if(letterIndex==40){
        
        letterIndex++; 
      }
     
    }
  }

  resetBtn.addEventListener('click', () => {
 
    type_content.innerHTML = '';

    loadPara();
  
    clearInterval(time);
    wpm.innerText = `WPM: `;
    error.innerText = 'Accuracy: ';
    timeSpent = 0;
    t_left.innerText = `Time: ${timeSpent}S`;
    (document.getElementById('typeValue') as HTMLInputElement).value = '';
    letterIndex = mistakes = 0;
    isTyping = false;
  });
    
  socket.on('yourTestResults', ({ userId, wpm, accuracy }) => {
    console.log(`Your test results: WPM=${wpm}, Accuracy=${accuracy}`);
    setWpmResult(wpm);
    setTimeResult(timeSpent);
    setCompleted(true);
  });

  socket.on('opponentTestResults', ({ userId, wpm, accuracy }) => {
    console.log(`Opponent's test results: WPM=${wpm}, Accuracy=${accuracy}`);
    setOpponentScores((prevScores) => {
 
      if (prevScores.some((score) => score.userId === userId)) {

        return prevScores.map((score) =>
          score.userId === userId ? { userId, wpm, accuracy } : score
        );  
      } else {

        return [...prevScores, { userId, wpm, accuracy }];
      }
    });
  });
  
  return () => {
    socket.off('yourTestResults');
    socket.off('opponentTestResults');
  };

  },[socket,user]);

  
  
  return (
    <>
      <div className='p-12' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="text-[#666] font-inter font-bold text-3xl type_content">
          <p className="practice mt-10 mb-10 ml-12 mr-12"></p>
        </div>
        <input type="text" id="typeValue" />

        <div className="flex flex-between justify-center align-center">
          <p className="mr-12 flex t_left text-[#FFFFFF] font-bold text-3xl type_content">
            Time:
          </p>
          <p className="mr-12 ml-12 flex error text-[#FFFFFF] font-bold text-3xl type_content">
            Accuracy:
          </p>
          <p className="pl-12 flex wpm text-[#FFFFFF] font-bold text-3xl type_content">
            WPM :
          </p>
        </div>

        {Multiplayer && completed && (
          <div>
            <p>Test Completed!</p>
            <p>Your Results:</p>
            <p>WPM: {wpmResult}</p>
            <p>Time taken: {timeResult} seconds</p>
            <p>User ID: {user?.uid}</p>

            {opponentScores.length > 0 && (
              <div>
                <p>Opponent Results:</p>
                {opponentScores.map((opponentScore) => (
                  <div key={opponentScore.userId}>
                    <p>User ID: {opponentScore.userId}</p>
                    <p>WPM: {opponentScore.wpm}</p>
                    <p>Accuracy: {opponentScore.accuracy}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-center items-center">
        <button className="mt-8 reset_button relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
          Reset
          </span>
        </button>
        </div>
      </div>
    </>
  );
};


export default TypingComponent;
