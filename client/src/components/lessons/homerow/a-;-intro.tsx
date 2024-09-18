import TypingComponent from '@/components/TypingComponent'
import React from 'react'
import Navbar from '@/components/Navbar'

export default function A_Intro() {  
    return (
      <>
      <Navbar/>
      <h1 className="text-center p-12 scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-1xl">
        Use your left pinky finger for A and right pinky finger for ;
      </h1>
      <TypingComponent Para='aaaa ;;;; aaaa ;;;; aa ;; aa ;; a;a; a;a; ;a;a ;a;a' Multiplayer={false}  Index={0} />
      </>
  )
}