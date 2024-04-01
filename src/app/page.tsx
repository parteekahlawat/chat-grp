"use client";
import { useEffect, useState } from "react";
import { socket } from "../socket";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

import Navbar from "./navbar";
import { CardWithForm } from "./comps/cardname";

export default function Home() {
  const [message, setMessage] = useState("Enter Message");
  const [recievemsg, setRecievemsg] = useState("");
  const [recieveId, setId] = useState("");
  const arr = [{message: "", username: ""}]
  const [displayMsg, setDisplayMsg] = useState([]);
  const { toast } = useToast();
  useEffect(() => {

    socket.on("connect", () => {
      console.log("Connected to server");
      toast({
        title: "Joined ITI Jammu Talks",
        description: "Be Freindly to everyone",
      })
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("all-message", (msg:string)=>{
      console.log("sent to all", msg, socket.id)
      setRecievemsg(msg)
    })
    socket.on("all-message-id", (id)=>{
      console.log("user: ", id, " sent the message");
      setId(id)
    })
    // setDisplayMsg(arr)

    return ;
  }, []);

  const handleClick = () => {
    socket.emit("message", message);
    console.log("Message sent to server:", message);
    setMessage("")
    arr.push({message: recievemsg, username: recieveId})
    setDisplayMsg(arr)
  };
  
  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessage(event.target.value);
  };

  return (
    <div>
      <script src="/socket.io/socket.io.js"></script>
      {/* <Navbar/> */}
      <CardWithForm/>
      <div className="flex flex-col h-screen">
        <nav className="bg-light border-gray-200 dark:bg-gray-900">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-center mx-auto p-4">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              ITI Jammu Talks
            </span>
          </div>
        </nav>
        
          {
            displayMsg.map((val)=>{
              return (
                <div className="flex-grow w-90vw max-h-60vh border border-gray-200 rounded overflow-auto box-border p-10 m-10">

                <div className="font-bold font-serif">{val.username}</div>
          <div className="w-full">
            {val.message}
          </div>
          </div>
              )
            })
          }
         
        <div className="grid gap-2 m-10">
          <Textarea placeholder={message} onChange={handleMessageChange} />
          <Button onClick={handleClick}>Send message</Button>
        </div>
      c</div>
    </div>
  );
}
