import Navbar from '@/components/Navbar'
import TypingComponent from '@/components/TypingComponent'
import React from 'react'

export default function Left_Hand() {
  return (
    <>
    <Navbar/>
    <h1 className="text-center p-12 scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-1xl">
        Use your right hand only for pressing spacebar, and type with left hand strictly.
      </h1>
    <div><TypingComponent Para='dad dada ad ada adad sad sada dasad fas fasd dada affa fada fasa saf fdds asdf' Multiplayer={false}  Index={0}/></div>
    </>

  )
}
