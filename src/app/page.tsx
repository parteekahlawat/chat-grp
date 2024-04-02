"use client";
import { useEffect, useState } from "react";
import { socket } from "../socket";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

import {
  uniqueNamesGenerator,
  NumberDictionary,
  countries,
} from "unique-names-generator";

export default function Home() {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("username");
  const [recievemsg, setRecievemsg] = useState("");
  const [recieveusername, setUser] = useState<string>("");
  const [displayMsg, setDisplayMsg] = useState([{ showuser: "", showmsg: "" }]);
  const { toast } = useToast();

  const numberDictionary = NumberDictionary.generate({ min: 0, max: 10 });
  const randomName = uniqueNamesGenerator({
    dictionaries: [countries, numberDictionary],
    length: 2,
    separator: "-",
  });

  useEffect(() => {
    setUsername(randomName);
  }, []);

  useEffect(() => {
    const obj = {
      showuser: recieveusername,
      showmsg: recievemsg,
    };
    setDisplayMsg((prevDisplayMsg) => [obj, ...prevDisplayMsg]);
    console.log(displayMsg)
  }, [recievemsg]);



  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
      toast({
        title: "Joined ITI Jammu Talks",
        description: "Be Freindly to everyone",
      });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("all-message", (msg: string) => {
      console.log("Recieved msg on client side :  ", msg);
      setRecievemsg(msg);

    });
    socket.on("rec-username", (user: String) => {
      console.log("Received username on client side: ", user);
      setUser(user.toString());
    });

    return;
  }, []);

  const handleClick = () => {
    socket.emit("sent-username", username, message);
    socket.emit("sent-message", message, username);
    console.log("Message sent to server:", message);
    setMessage(" ");
  };

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessage(event.target.value);
  };

  return (
    <div>
      <div className="flex flex-col h-screen">
        <nav className="bg-light border-gray-200 dark:bg-gray-900">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-center mx-auto p-4">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              ITI Jammu Talks
            </span>
          </div>
        </nav>
        <div className="grid gap-2 m-10">
        <div className="font-bold font-serif">Your Username is : {username}</div>
        </div>
        <div className="flex-grow w-90vw max-h-60vh border border-gray-200 rounded overflow-auto box-border p-10 m-10">
        {displayMsg.map((val, index) => {
          return (
            <div key={index}>
              <div className="font-bold font-serif">{val.showuser}</div>
              <div className="w-full">{val.showmsg}</div>
            </div>         
          );
        })}
        </div>
        <div className="grid gap-2 m-10">
          <Textarea placeholder="Enter Message" onChange={handleMessageChange} value={message}/>
          <Button onClick={handleClick}>Send message</Button>
        </div>
      </div>
    </div>
  );
}
