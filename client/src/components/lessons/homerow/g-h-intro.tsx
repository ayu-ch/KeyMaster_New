import TypingComponent from '@/components/TypingComponent'
import React from 'react'
import Navbar from '@/components/Navbar'

export default function G_H_Intro() {
  return (
    <>
    <Navbar/>
      <h1 className="text-center p-12 scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-1xl">
        Use your left index finger for G  and right index finger for H
      </h1>
    <div><TypingComponent Para='gggg hhhh gggg hhhh gg hh gg hh ghgh ghgh hghg hghg'Multiplayer={false}  Index={0}/></div>
    </>
  )
}
