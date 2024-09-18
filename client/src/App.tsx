import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import { SocketProvider } from './components/socketContext';
import { UserAuthContextProvider } from './context/UserAuthContext';
import { ThemeProvider } from './components/theme-provider';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Lessons from './components/Lessons';
import Practice from './components/Practice';
import Profile from './components/profile';
import ProtectedRoute from './components/ProtectedRoute';
import Homerow from './components/lessons/Homerow';
import SocketComponent from './components/SocketComponent';
import Rooms from './components/Rooms';
import F_J_Intro from './components/lessons/homerow/f-j-intro';
import F_J_Practice from './components/lessons/homerow/f-j-practice';
import D_K_Intro from './components/lessons/homerow/d-k-intro';
import D_K_Practice from './components/lessons/homerow/d-k-practice';
import F_J_D_K_Practice from './components/lessons/homerow/f-j-d-k-practice';
import S_L_Intro from './components/lessons/homerow/s-l-intro';
import S_L_Practice from './components/lessons/homerow/s-l-practice';
import S_L_D_K_F_J_Practice from './components/lessons/homerow/s-l-d-k-fj-practice';
import A_Intro from './components/lessons/homerow/a-;-intro';
import A_Practice from './components/lessons/homerow/a-;-practice';
import Left_Hand from './components/lessons/homerow/left-hand';
import Right_Hand from './components/lessons/homerow/right-hand';
import G_H_Intro from './components/lessons/homerow/g-h-intro';
import G_H_Practice from './components/lessons/homerow/g-h-practice';
import Homerow_Practice from './components/lessons/homerow/homerow-practice';

export default function App() {
  const serverUrl = 'http://localhost:3001';
  const socket = io(serverUrl, { transports: ['websocket'] });

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <UserAuthContextProvider>
        <SocketProvider socket={socket}>
          <Routes>
         
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            <Route path="/lessons" element={<ProtectedRoute><Lessons /></ProtectedRoute>} />
            <Route path="/lessons/homerow" element={<ProtectedRoute><Homerow /></ProtectedRoute>} />
            <Route path="/lessons/homerow/f-j-intro" element={<ProtectedRoute><F_J_Intro/></ProtectedRoute>} />
            <Route path="/lessons/homerow/f-j-practice" element={<ProtectedRoute><F_J_Practice/></ProtectedRoute>} />
            <Route path="/lessons/homerow/d-k-intro" element={<ProtectedRoute><D_K_Intro/></ProtectedRoute>} />
            <Route path="/lessons/homerow/d-k-practice" element={<ProtectedRoute><D_K_Practice/></ProtectedRoute>} />
            <Route path="/lessons/homerow/f-j-d-k-practice" element={<ProtectedRoute><F_J_D_K_Practice/></ProtectedRoute>} />
            <Route path="/lessons/homerow/s-l-intro" element={<ProtectedRoute><S_L_Intro/></ProtectedRoute>} />
            <Route path="/lessons/homerow/s-l-practice" element={<ProtectedRoute><S_L_Practice/></ProtectedRoute>} />
            <Route path="/lessons/homerow/s-l-d-k-f-j-practice" element={<ProtectedRoute><S_L_D_K_F_J_Practice/></ProtectedRoute>} />
            <Route path="/lessons/homerow/a-;-intro" element={<ProtectedRoute><A_Intro/></ProtectedRoute>} />
            <Route path="/lessons/homerow/a-;-practice" element={<ProtectedRoute><A_Practice/></ProtectedRoute>} />
            <Route path="/lessons/homerow/home-left-hand" element={<ProtectedRoute><Left_Hand/></ProtectedRoute>} />
            <Route path="/lessons/homerow/home-right-hand" element={<ProtectedRoute><Right_Hand/></ProtectedRoute>} />
            <Route path="/lessons/homerow/g-h-intro" element={<ProtectedRoute><G_H_Intro/></ProtectedRoute>} />
            <Route path="/lessons/homerow/g-h-practice" element={<ProtectedRoute><G_H_Practice/></ProtectedRoute>} />
            <Route path="/lessons/homerow/homerow-practice" element={<ProtectedRoute><Homerow_Practice/></ProtectedRoute>} />
    
            <Route path="/multiplayer" element={<ProtectedRoute><SocketComponent /></ProtectedRoute>} />
            <Route path="/multiplayer/:roomId" element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
            
     
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </SocketProvider>
      </UserAuthContextProvider>
    </ThemeProvider>
  );
}