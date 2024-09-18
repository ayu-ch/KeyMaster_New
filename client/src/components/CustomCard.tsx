import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'

interface CustomCardProps {
  title: string;
  linkTo: string;
}

const CustomCard: React.FC<CustomCardProps> = ({ title, linkTo }) => {
  return (
    <Card className="w-[350px] m-12">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardFooter className="flex justify-between center-align">
        <Button>
          <Link to={linkTo}>Start</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CustomCard;