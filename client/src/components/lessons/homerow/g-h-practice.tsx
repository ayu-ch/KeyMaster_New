import TypingComponent from '@/components/TypingComponent'
import React from 'react'
import Navbar from '@/components/Navbar'

export default function G_H_Practice() {
  return (
    <>
    <Navbar/>
      <h1 className="text-center p-12 scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-1xl">
        Try to get 100% accuracy and then increase your speed gradually
      </h1>
    <div><TypingComponent Para='gf ggf gf ggf hj hhj hj hhj gfgf hjhj gggf hhhj fghj fgf jhj fgfgf jhjhj ggf hhj gghh ghgh ghfj ggf hhj' Multiplayer={false}  Index={0}/></div>
    </>
  )
}
