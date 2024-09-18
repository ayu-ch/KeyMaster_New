import React from 'react'
import { useEffect,useState } from 'react';
import { Button } from './ui/button';
import Navbar from './Navbar';
import "firebase/database";
import "firebase/auth"
import { User } from "firebase/auth";
import { useUserAuth} from "../context/UserAuthContext";
import { Navigate,useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import { Database } from 'firebase/database';
import { getDatabase, ref, push, onValue, update  } from 'firebase/database';
import app from '@/firebase';
import { Line } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import { Chart, CategoryScale, LinearScale, LineController, LineElement, PointElement, Title, Tooltip } from 'chart.js';


Chart.register(CategoryScale, LinearScale, LineController, LineElement, PointElement, Title, Tooltip);





interface FirebaseData {
  [key: string]: {
    date: string; 
    wpm: number;
  }; 
}


export default function Practice() {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      fill: boolean;
      borderColor: string;
      tension: number;
    }[];
  }>({
    labels: [],
    datasets: [
      {
        label: 'WPM Over Time',
        data: [],
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  });

  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();
  

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  
  

  
  useEffect(() => {
    const database = getDatabase(app);
    const userRef = ref(database, `users/${user?.uid}/tests`);
    const keyMistakesRef = ref(database, `users/${user?.uid}/keyMistakes`);
    


    const words = ["the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "make", "when", "can", "more", "no", "man", "out", "other", "so", "what", "time", "up", "go", "about", "than", "into", "could", "state", "only", "new", "year", "some", "take", "come", "these", "know", "see", "use", "get", "like", "then", "first", "any", "work", "now", "may", "such", "give", "over", "think", "most", "even", "find", "day", "also", "after", "way", "many", "must", "look", "before", "great", "back", "through", "long", "where", "much", "should", "well", "people", "down", "own", "just", "because", "good", "each", "those", "feel", "seem", "how", "high", "too", "place", "little", "world", "very", "still", "nation", "hand", "old", "life", "tell", "write", "become", "here", "show", "house", "both", "between", "need", "mean", "call", "develop", "under", "last", "right", "move", "thing", "general", "school", "never", "same", "another", "begin", "while", "number", "part", "turn", "real", "leave", "might", "want", "point", "form", "off", "child", "few", "small", "since", "against", "ask", "late", "home", "interest", "large", "person", "end", "open", "public", "follow", "during", "present", "without", "again", "hold", "govern", "around", "possible", "head", "consider", "word", "program", "problem", "however", "lead", "system", "set", "order", "eye", "plan", "run", "keep", "face", "fact", "group", "play", "stand", "increase", "early", "course", "change", "help", "line"]
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
    let maxTime=15;
    let timeLeft= maxTime;
    
   
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

    const keyMistakes: { [key: string]: number } = {};
    const keys = "abcdefghijklmnopqrstuvwxyz";
    for (const key of keys) {
      keyMistakes[key] = 0;
    }

    const loadPara = () => {
          const randomWord=() =>{
            return words[Math.floor(Math.random()* words.length)]
          } 
          type_content.innerHTML="";

          var randomPara = ""
          for (var i=0; i<50; i++){
            randomPara+=randomWord()+" "
          }
          
          randomPara.split('').forEach(element=>{
            let realData = `<span>${element}</span>`;
            type_content.innerHTML+=realData;
          })
          document.addEventListener('click', ()=>{
            input.focus();
          })
          type_content.addEventListener('click', ()=>{
            input.focus();
          })
          console.log(randomPara);
   }
  loadPara();

  


  input.addEventListener('input', (e: Event) => {
    const target = e.target as HTMLInputElement;
    let char = type_content.querySelectorAll('span');
    let inputValue = target.value.split('')[letterIndex];
  
    if (!isTyping) {
      time = window.setInterval(timeSetup, 1000);
      isTyping = true;
    }
  
    if (letterIndex < char.length - 1) {
      if (inputValue == null) {
        if (letterIndex > 0) {
          letterIndex--;
          if (char[letterIndex].classList.contains('incorrect')) {
            mistakes--;
          }
          char[letterIndex].classList.remove('correct', 'incorrect');
        }
      } else {
        if (char[letterIndex].innerText == inputValue) {
          char[letterIndex].classList.add(`correct`);
        } else {
          char[letterIndex].classList.add(`incorrect`);
          mistakes++;
          keyMistakes[char[letterIndex].innerText] += 1;
        }
      }
      letterIndex++;
    } 

    update(keyMistakesRef, keyMistakes);
  });


  let wpmTab:number;
  let accuracyTab:number;

  const timeSetup = () =>{
    if(timeLeft>0){
      timeLeft--;
      t_left.innerText = `Time :${timeLeft}S`
      wpmTab = Math.round((letterIndex-mistakes)/5/(maxTime-timeLeft)*60);
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
      if(timeLeft==0){
        const currentDate = new Date().toString();
        saveUserData(user?.uid || '', currentDate, wpmTab, accuracyTab);
        letterIndex=mistakes=0
        timeLeft--; 
      }
    
    }
  }

  resetBtn.addEventListener('click', () => {
    loadPara();
    clearInterval(time);
    wpm.innerText = `WPM: `;
    error.innerText = 'Accuracy: ';
    timeLeft = maxTime;
    t_left.innerText = `Time: ${maxTime}S`;
    (document.getElementById('typeValue') as HTMLInputElement).value = '';
    letterIndex = mistakes = 0;
    isTyping = false;

  });

 

  onValue(userRef, (snapshot) => {
    const data: FirebaseData | null = snapshot.val();
    if (!data) {
      console.error('No data available');
      return;
    }

    const dates = Object.values(data).map((entry) => entry.date);
    const wpms = Object.values(data).map((entry) => entry.wpm);

    const chartData = {
      labels: dates,
      datasets: [
        {
          label: 'WPM Over Time',
          data: wpms,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1,
        },
      ],
    };
    setChartData(chartData);
  }, (error) => {
    console.error('Error fetching data:', error);
  });
}, [user]);

  const options:ChartOptions<'line'>= {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display:false
      },
      y: {
        beginAtZero: true, 
        title: {
          display: true,
          text: 'WPM', 
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          precision: 0, 
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
        mode: 'index',
      },
    },
  };
  
    return (
      <>
      <Navbar />
      <div className='p-12' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="text-[#666] font-inter font-bold text-3xl type_content">
          <p className='practice mt-10 mb-10 text-center'></p>
        </div>
        <input type="text" id="typeValue" />
      <div className='thisdiv' style={{zIndex:'99'}}>
        <div className='flex flex-between justify-center align-center'>
          <p className="mr-12 flex t_left text-[#FFFFFF] font-bold text-3xl type_content">Time: </p>
          <p className="mr-12 ml-12 flex error text-[#FFFFFF] font-bold text-3xl type_content">Accuracy: </p>
          <p className="pl-12 flex wpm text-[#FFFFFF] font-bold text-3xl type_content">WPM : </p>
        </div>
        <div className="flex justify-center items-center">
        <button className="mt-8 reset_button relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
          <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
          Reset
          </span>
        </button>
        </div>
        </div>
      </div>
    </>
  )
}