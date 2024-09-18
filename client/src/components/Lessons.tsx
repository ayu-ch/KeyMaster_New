import React from 'react'
import Navbar from './Navbar'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import ProtectedRoute from "./ProtectedRoute"
import { Route,Routes } from 'react-router-dom'
import Homerow from './lessons/Homerow'
import { Link } from 'react-router-dom'


export default function Lessons() {
  return (
    <>
    <Navbar />
    <div style={{height:'100vh  '}}>
      <div>
      <h1 className="text-center p-12 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Master your typing skills
      </h1>
      <hr/>
      </div>
    <div className=" p-12 flex justify-between">
    <Card className="w-[350px] m-12">
      <CardHeader>
        <CardTitle>Home Row</CardTitle>
        
      </CardHeader>
      <CardContent>
        Learn Home Row
      </CardContent>
      <CardFooter className="flex justify-between center-align">
        <Button><Link to='/lessons/homerow'>Start</Link></Button>
      </CardFooter>
    </Card>
    <Card className="w-[350px] m-12">
      <CardHeader>
        <CardTitle>Top Row</CardTitle>
        
      </CardHeader>
      <CardContent>
        Learn Top Row
      </CardContent>
      <CardFooter className="flex justify-between center-align">
        <Button>Start</Button>
      </CardFooter>
    </Card>
    <Card className="w-[350px] m-12">
      <CardHeader>
        <CardTitle>Bottom Row</CardTitle>
        
      </CardHeader>
      <CardContent>
        Learn Bottom Row
      </CardContent>
      <CardFooter className="flex justify-between center-align">
        <Button>Start</Button>
      </CardFooter>
    </Card>
    </div>
    </div>
    
    </>
  )
}
