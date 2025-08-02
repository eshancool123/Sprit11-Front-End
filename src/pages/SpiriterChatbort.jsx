import React, { useState, useEffect, useRef } from "react";

const SpiriterChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Spiriter, your game assistant. Ask me about team compositions, player statistics, or game strategies.",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions] = useState([
    "Show optimal team for arena",
    "Top 5 DPS characters",
    "Player statistics for GamerTag123",
    "Best support characters",
  ]);
  const messageEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchBotResponse = async (question) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/chatbot/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: question }),
      });
      console.log(response);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return (
        data.answer || "Sorry, I couldn't find an answer to that question."
      );
    } catch (error) {
      console.error("Error fetching response:", error);
      return "Sorry, there was an error processing your request. Please try again later.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e.preventDefault) {
      e.preventDefault();
    }

    if (input.trim() === "") return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);

    // Add a loading message
    const loadingMsgId = messages.length + 2;
    setMessages((prev) => [
      ...prev,
      {
        id: loadingMsgId,
        text: "Thinking...",
        sender: "bot",
        isLoading: true,
      },
    ]);

    // Fetch response from the API
    const botResponse = await fetchBotResponse(input);

    // Remove loading message and add the real response
    setMessages((prev) => prev.filter((msg) => msg.id !== loadingMsgId));
    setMessages((prev) => [
      ...prev,
      {
        id: loadingMsgId,
        text: botResponse,
        sender: "bot",
      },
    ]);

    setInput("");
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    // Automatically submit after a short delay
    setTimeout(() => {
      handleSubmit({});
    }, 100);
  };

  return (
    <div className="flex flex-col h-screen w-4/5 mx-auto m-4 border border-blue-200 rounded-lg overflow-hidden bg-white shadow-lg">
      {/* Header */}
      <div className="bg-gray-200 text-blue-600 p-4 shadow-md">
        <h1 className="text-xl font-bold">Spiriter Game Assistant</h1>
        <p className="text-sm opacity-80">
          Your companion for optimal gameplay
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto bg-white">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg max-w-xs md:max-w-md ${
                message.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-blue-100 text-blue-900 rounded-bl-none"
              }`}
            >
              {message.isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div
                    className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              ) : (
                message.text.split("\n").map((text, i) => (
                  <p key={i} className={i > 0 ? "mt-1" : ""}>
                    {text}
                  </p>
                ))
              )}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {/* Suggestions */}
      <div className="p-2 bg-white border-t border-blue-100">
        <p className="text-xs text-blue-500 mb-2">Suggested queries:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="text-xs py-1 px-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 border border-blue-200"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-white border-t border-blue-200 flex"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about team compositions, player stats..."
          className="flex-1 border border-blue-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`px-4 rounded-r-lg focus:outline-none ${
            isLoading
              ? "bg-blue-400 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default SpiriterChatbot;
