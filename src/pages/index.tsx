import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

import { io } from "socket.io-client";
import { useEffect, useState } from 'react';

const socket = io("https://localhost:4000", { transports: ["websocket"] });

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [text, setText] = useState('');
  const handleSend = () => {
    socket.send(text);
    setText('');
  }

  useEffect(() => {
    socket.on('message', (msg: string) => {
      setMessages((msgs: string[]) => [msg,...msgs])
    })
    return () => {socket.off('message');}
  }, []);
  return (
    <main
    >
      {messages.map((msg, idx) => <div key={idx}>{msg}</div>)}
      <div>
        <input value={text} onChange={(e) => setText(e.currentTarget.value)} />
        <button onClick={handleSend}>Send</button>
      </div>
    </main>
  )
}
