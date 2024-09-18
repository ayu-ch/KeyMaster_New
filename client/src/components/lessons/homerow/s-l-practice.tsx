import TypingComponent from '@/components/TypingComponent'
import React from 'react'
import Navbar from '@/components/Navbar'
export default function S_L_Practice() {
  return (
    <>
    <Navbar/>
      <h1 className="text-center p-12 scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-1xl">
        Try to get 100% accuracy and then increase your speed gradually
      </h1>
    <div><TypingComponent Para='ll ss ssll slsl lsssl slls lsll ssl llss ssll  slsl llsslsll ssl ssll slsl lsll ll' Multiplayer={false} Index={0}/></div>
    </>
  )
}
