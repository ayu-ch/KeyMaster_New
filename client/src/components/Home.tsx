import React from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { useUserAuth} from "../context/UserAuthContext";
import Lessons from "./Lessons";
import Navbar from "./Navbar";
import { User } from "firebase/auth";
const Home: React.FC = () => {
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <>
    <Navbar />
    <div style={{height:'100vh'}}>

      <div className="p-4 box mt-3 text-center">
        <h1 className="text-[#FFFFFF] font-bold text-6xl">Hello Welcome </h1><br />
        {user && (user as User).displayName}
      </div>

      
    </div>
    </>
  );
};

export default Home;