import React from 'react'

import TypingComponent from '@/components/TypingComponent';
import Navbar from '@/components/Navbar';








export default function F_J_Intro() {
  

  
  
    return (
      <>
      <Navbar/>
      <h1 className="text-center p-12 scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-1xl">
        Use your left index finger for F and right index finger for J
      </h1>

      <TypingComponent Para='ffff jjjj ffff jjjj ff jj ff jj fjfj fjfj jfjf jfjf' Multiplayer={false}  Index={0}/>
      </>
  )
}