import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { Button } from './ui/button';

const SocketComponent = () => {
  const [roomId, setRoomId] = useState('');
  const [joinedRoom, setJoinedRoom] = useState('');
  const serverUrl = 'http://localhost:3001'; 
  const socket = io(serverUrl, { transports : ['websocket'] });
  const navigate = useNavigate(); 



  const generateRoom = () => {
    socket.emit('createRoom');

    socket.on('roomCreated', (roomId) => {
      setRoomId(roomId);

      navigate(`/multiplayer/${roomId}`);
    });
  };

  useEffect(() => {
    socket.on('roomCreated', (roomId) => {
      setRoomId(roomId);
    });
  
    socket.on('joinedRoom', (roomId) => {
      setJoinedRoom(roomId);
    });
  
    
    return () => {
      socket.disconnect();
      socket.off('roomCreated');
      socket.off('joinedRoom');
    };
  }, [socket]);

  const joinRoom = () => {
    const roomIdToJoin = prompt('Enter the room ID:');
    socket.emit('joinRoom', roomIdToJoin);

    socket.on('joinedRoom', (roomId) => {
      setJoinedRoom(roomId);

      navigate(`/multiplayer/${roomId}`); 
    });
  };

  
  return (
    <>
    <Navbar />
    <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-center p-12 scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl">
        Race Against your friends!
      </h1>
      <h1 className="text-center  scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-1xl">
        Create a room , or join an existing one
      </h1>
    
  <Button onClick={generateRoom} className='m-5'>Generate Room</Button>
  <Button onClick={joinRoom}>Join Room</Button>
</div>
</>
  );
};

export default SocketComponent;