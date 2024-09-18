import React from 'react'
import Navbar from '../Navbar'
import CustomCard
 from '../CustomCard'

export default function Homerow() {
  return (
    
    <div style={{height:'100vh  '}}>
      <Navbar/>
      <div>
      <h1 className="text-center p-12 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Master your typing skills
      </h1>
      <hr/>
      </div>
    <div className="p-12 grid grid-cols-3 gap-4">
    <CustomCard title="F-J Intro" linkTo="/lessons/homerow/f-j-intro" />
    <CustomCard title="F-J Practice" linkTo="/lessons/homerow/f-j-practice" />
    <CustomCard title="D-K Intro" linkTo="/lessons/homerow/d-k-intro" />
    <CustomCard title="D-K Review" linkTo="/lessons/homerow/d-k-practice" />
    <CustomCard title="D-K Practice" linkTo="/lessons/homerow/f-j-d-k-practice" />
    <CustomCard title="S-L Intro" linkTo="/lessons/homerow/s-l-intro" />
    <CustomCard title="S-L Review" linkTo="/lessons/homerow/s-l-practice" />
    <CustomCard title="S-L Practice" linkTo="/lessons/homerow/s-l-d-k-f-j-practice" />
    <CustomCard title="A-; Intro" linkTo="/lessons/homerow/a-;-intro" />
    <CustomCard title="A-; Practice" linkTo="/lessons/homerow/a-;-practice" />
    <CustomCard title="Left Hand Practice" linkTo="/lessons/homerow/home-left-hand" />
    <CustomCard title="Right Hand Practice" linkTo="/lessons/homerow/home-right-hand" />
    <CustomCard title="G-H Intro" linkTo="/lessons/homerow/g-h-intro" />
    <CustomCard title="G-H Practice" linkTo="/lessons/homerow/g-h-practice" />
    <CustomCard title="Homerow Practice" linkTo="/lessons/homerow/homerow-practice" />
    </div>
    </div>
  )
}
