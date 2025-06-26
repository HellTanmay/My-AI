import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BotIcon, Send } from "lucide-react";

function App() {
  function getSessionId() {
    let id = localStorage.getItem("chat-session-id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("chat-session-id", id);
    }
    return id;
  }

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = async () => {
    if (inputMessage.trim().length === 0) return;
    await setMessages((prev) => [
      ...prev,
      { role: "user", text: inputMessage },
    ]);
    try {
      const res = await fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: getSessionId(),
          userMessage: inputMessage,
        }),
      });
      setInputMessage(" ");

      if (res.ok) {
        const data = await res.json();
        return data;
      } else {
        throw new Error("Something went wrong");
      }
    } catch (err) {
      throw err;
    }
  };
  const mutation = useMutation({
    mutationFn: handleSendMessage,
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: "ai", text: data?.result }]);
    },
    onError: (err) => {
      console.log(err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Something went wrong" },
      ]);
    },
  });
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      mutation.mutate();
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] max-w-4xl mx-auto bg-white p-2 overflow-hidden relative">
      {/* Title at the top */}
      <div className="bg-blue-600 text-white p-4 text-center flex  justify-center ">
        <BotIcon />
        <h1 className="text-xl font-semibold ml-3">My AI</h1>
      </div>
      {/* Chat body section at the center */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {mutation.isPending && (
            <div className="flex">
              <div className="text-5xl animate-ping">.</div>
              <div className="text-5xl animate-ping delay-200">.</div>
              <div className="text-5xl animate-ping delay-400">.</div>
            </div>
          )}
        </div>
      </div>

      {/* Textbox and send button at the bottom */}
      <div className="border-t border-gray-200 p-4 bg-white absolute bottom-0 right-0 left-0 z-10">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            onFocus={() => {
              // Scroll to bottom to make input visible above keyboard
              setTimeout(() => {
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                });
              }, 100);
            }}
            className="flex-1"
          />
          <Button
            onClick={() => mutation.mutate()}
            disabled={inputMessage.trim().length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
