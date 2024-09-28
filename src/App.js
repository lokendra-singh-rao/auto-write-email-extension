// src/App.js
import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import "dotenv/config"

const App = () => {
  const [replyLength, setReplyLength] = useState("short");
  const [generatedReply, setGeneratedReply] = useState({});
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [copied, setCopied] = useState(true);
  const [givenEmailContent, setGivenEmailContent] = useState("");
  const [lengthTypes, setLengthTypes] = useState({
    short: "short (50 words)",
    medium: "medium (100 words)",
    long: "long (150 words)",
  });

  const generateReply = async () => {
    try {
      lengthTypes.map(async (lengthType) => {
        const url = "https://cloud.olakrutrim.com/v1/chat/completions";
        const data = {
          model: "Krutrim-spectre-v2",
          messages: [
            {
              role: "system",
              content: `Generate a ${lengthType} length reply for the email`,
            },
            {
              role: "user",
              content: givenEmailContent,
            },
          ],
          frequency_penalty: 0,
          logprobs: true,
          top_logprobs: 2,
          max_tokens: 256,
          n: 1,
          presence_penalty: 0,
          response_format: { type: "text" },
          stream: false,
          temperature: 0,
          top_p: 1,
        };

        const response = await axios.post(url, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.KRUTRIM_SECRET_KEY}`,
          },
        });

        console.log(response.data);
      });
    } catch (error) {
      console.log("Error fetching email reply...", error);
    }
  };

  const handleGenerateReply = () => {
    generateReply();
    setLoading(true);
    setTimeout(() => {
      const replies = {
        short: "This is a short reply.",
        medium: "This is a medium-length reply, providing a bit more detail.",
        long: "This is a long reply, which contains a comprehensive explanation and is meant to provide thorough understanding.",
      };
      setGeneratedReply(replies);
      setLoading(false);
    }, 1000);
  };

  const handleTabClick = (length) => {
    setReplyLength(length);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(generatedReply);
    setCopied(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }, [copied]);

  console.log("generatedReply", generatedReply);
  console.log("replyLength", replyLength);
  return (
    <div className={`App ${darkMode ? "dark" : "light"}`}>
      <div className="toggle-button" onClick={handleToggleDarkMode}>
        {darkMode ? "🌙" : "🌞"}
      </div>
      <h3>Welcome to Your Chrome Extension</h3>
      <textarea className="email-input" placeholder="Enter your email body here..." onChange={(e) => setGivenEmailContent(e.target.value)} value={givenEmailContent}></textarea>
      <button className="generate-button" onClick={handleGenerateReply}>
        Generate Reply
      </button>
      {loading && <div className="loading">Loading...</div>}
      {generatedReply && (
        <div className="reply-options">
          <div className="tabs">
            {["short", "medium", "long"].map((length) => (
              <button key={length} className={`tab ${replyLength === length ? "active" : ""}`} onClick={() => handleTabClick(length)}>
                {length.charAt(0).toUpperCase() + length.slice(1)}
              </button>
            ))}
          </div>
          <div className="reply-container">
            <textarea className="reply-box" value={generatedReply[replyLength]} readOnly></textarea>
            <button className="copy-button" onClick={handleCopyResponse}>
              {!copied ? "Copy" : "Copied!"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
