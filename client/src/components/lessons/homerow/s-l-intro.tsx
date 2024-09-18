import TypingComponent from '@/components/TypingComponent'
import React from 'react'
import Navbar from '@/components/Navbar'

export default function S_L_Intro() {
  return (
    <>
    <Navbar/>
      <h1 className="text-center p-12 scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-1xl">
        Use your left ring finger for S and right ring finger for L
      </h1>
    <div><TypingComponent Para='ssss llll ssss llll ss ll ss ll slsl slsl lsls lsls' Multiplayer={false}  Index={0}/></div>
    </>
  )
}
