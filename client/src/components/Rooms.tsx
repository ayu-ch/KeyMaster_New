import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from './socketContext';
import TypingComponent from './TypingComponent';
import { Button } from './ui/button';
import { useUserAuth } from '@/context/UserAuthContext';
import { useNavigate } from 'react-router-dom';

const Rooms = () => {
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();
  const Para:string = 'hello my name is ayush';
  const length: number = Para.length;


  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const displayName = user?.displayName;
  const { roomId } = useParams();
  const socket = useSocket();
  const [usersInRoom, setUsersInRoom] = useState<string[]>([]);
  const [showComponent, setShowComponent] = useState(false);
  const [pressedUsers, setPressedUsers] = useState<string[]>([]);
  const [newIndex, setNewIndex] = useState<number>(0);
  const [opponentScores, setOpponentScores] = useState<{ [userId: string]: { wpm: number; accuracy: number } }>({});

  const [completed, setCompleted] = useState(false);
  const [wpmResult, setWpmResult] = useState<number | null>(null);
  const [timeResult, setTimeResult] = useState<number | null>(null);


  
  useEffect(() => {
    let keyHasBeenPressed = false;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!keyHasBeenPressed) {
        keyHasBeenPressed = true;
        setNewIndex((prevIndex) => prevIndex + 1);
      }
    };

    const handleKeyUp = () => {
      keyHasBeenPressed = false;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };    
  }, []);

  useEffect(() => {
    socket?.emit('indexIncrement', { newIndex });
  }, [socket, newIndex]);

  function updateUI(newIndex: number) {
    const indexDisplayElement = document.getElementById('indexDisplay');
    if (indexDisplayElement) {
      indexDisplayElement.innerText = `Index: ${newIndex}`;
      let type_content = document.querySelector('.type_content p') as HTMLElement;
      const char = type_content.querySelectorAll('span');
      if(newIndex != 0){
        char[newIndex-1].classList.add('opponent');
      }
    }
  }

  useEffect(() => {
    if (socket) {
      socket.emit('joinRoom', roomId);

      socket.on('usersInRoom', (users: string[]) => {
        setUsersInRoom(users);
      });

      socket.on('startTypingTest', () => {
        setShowComponent(true);
        console.log('Received startTypingTest event');
      });

      socket.on('indexIncrement', (data: { newIndex: number }) => {
        updateUI(data.newIndex);
      });

      socket.on('buttonPressed', (userId: string) => {
        setPressedUsers((prevUsers) => [...prevUsers, userId]);
      });

      socket.on('opponentTestResults', ({ userId, wpm, accuracy}) => {
        setOpponentScores((prevScores) => ({
          ...prevScores,
          [userId]: { wpm, accuracy},
        }));
      });
    
    }

    return () => {
      if (socket) {
        socket.off('usersInRoom');
        socket.off('startTypingTest');
        socket.off('indexIncrement');
        socket.off('buttonPressed');
        socket.off('opponentTestResults');
      }
    };
  }, [socket, roomId]);

  const handleButtonPress = () => {
    if (socket) {
      socket.emit('buttonPressed', roomId);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (pressedUsers.length === usersInRoom.length) {
      timer = setTimeout(() => {
        setShowComponent(true);
        if (socket) {
          socket.emit('startTypingTest');
        }
      }, 3000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [pressedUsers, usersInRoom.length, socket]);

  useEffect(()=>{

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
          char[letterIndex].classList.remove('opponent');
          
        } else {
          char[letterIndex].classList.add('incorrect');
          char[letterIndex].classList.remove('opponent');
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
  },[socket])

  return (
    <div>
      
      <div>
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
        <Button className="reset_button">
          Reset
        </Button>
      </div>
      <h1>Room: {roomId}</h1>
      <h1>Share this id with your friends</h1>
      <ul>
    {usersInRoom.map((userId) => (
      <li key={userId}>
        {userId} - WPM: {opponentScores[userId]?.wpm}, Accuracy: {opponentScores[userId]?.accuracy}
      </li>
    ))}
    </ul>
    <p id="indexDisplay">Index: {newIndex}</p>
  </div>
  );
};

export default Rooms;