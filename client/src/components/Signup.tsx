import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert} from "react-bootstrap";
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

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>(""); // State for display name
  const { signUp } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signUp(email, password, displayName); // Passing displayName to signUp function
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden">
      <div className="w-full m-auto bg-white lg:max-w-lg">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
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
              <div className="grid gap-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  type="text"
                  placeholder="Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full" variant="outline">
                Sign Up
              </Button>
            </CardFooter>
          </form>
          <p className="mt-2 text-xs text-center text-gray-700 mb-2">
            Already have an account?{" "}
            <span className=" text-blue-600 hover:underline">
              <Link to="/">SignUp</Link>
            </span>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Signup;