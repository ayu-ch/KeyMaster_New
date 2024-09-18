import React, { createContext, useContext } from 'react';
import { Socket } from 'socket.io-client';

type SocketContextProps = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextProps>({
  socket: null,
});

export const useSocket = (): Socket | null => {
  const { socket } = useContext(SocketContext);
  return socket;
};

interface SocketProviderProps {
  children: React.ReactNode;
  socket: Socket | null;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children, socket }) => {
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};