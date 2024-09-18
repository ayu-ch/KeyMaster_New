import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert} from "react-bootstrap";
import GoogleButton from "react-google-button";
import { useUserAuth } from "../context/UserAuthContext";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {useTypewriter, Cursor} from 'react-simple-typewriter'

interface TypewriterText {
  hello: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { logIn, googleSignIn } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await logIn(email, password);
      navigate("/home");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async (e: any) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/home");
    } catch (err) {
      console.log((err as Error).message);
    }
  };

  const [hello] =useTypewriter({
    words:["Take your typing to the next level"],
    typeSpeed:100
  })

  return (
   
    <div className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden" >
      <h1 className="pt-12 mt-12 text-[#FFFFFF] font-bold text-6xl">KeyMaster</h1>
      <h3 className="text-[#666] font-bold pt-2 text-2xl">{hello}<span style={{color:"white"}}><Cursor cursorStyle="|"/></span></h3>
      
      <div className="w-full m-auto bg-white lg:max-w-lg">
        <Card>
          <CardHeader className="space-y-1 ">
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to login
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              {error && <Alert variant="danger">{error}</Alert>}
              <Input type="email"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="w-full" variant="outline" >Login</Button>
          </CardFooter>
          </form>

          <div className="relative mb-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid gap-6 m-2">
            <Button className="w-full" onClick={handleGoogleSignIn}>
            
              Google
            </Button>
            
          </div>

          <p className="mt-2 text-xs text-center text-gray-700 mb-2">
            {" "}
            Don't have an account?{" "}
            <span className=" text-blue-600 hover:underline"><Link to="/signup">Sign up</Link></span>
          </p>
        </Card>
      </div>
    </div>

    
   
  );
};

export default Login;