import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick?: () => void;
  buttonText?: string;
  className?: string;
}

const DashboardCard = ({
  title = "Card Title",
  description = "This is a description of the dashboard card functionality.",
  icon: Icon = () => (
    <div className="w-10 h-10 rounded-full bg-primary/20"></div>
  ),
  onClick = () => {},
  buttonText = "View",
  className = "",
}: DashboardCardProps) => {
  return (
    <Card
      className={`w-full max-w-[420px] h-[300px] flex flex-col bg-white ${className}`}
    >
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <Icon size={24} />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Content area can be customized based on card type */}
        <div className="h-full flex items-center justify-center">
          <div className="text-muted-foreground text-sm">Card content area</div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button onClick={onClick} className="w-full">
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DashboardCard;
