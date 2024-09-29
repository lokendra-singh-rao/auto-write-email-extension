// src/App.js
import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Loader from "./components/loader/Loader.js";

const App = () => {
  const [replyLength, setReplyLength] = useState("short");
  const [generatedReply, setGeneratedReply] = useState({});
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [copied, setCopied] = useState(true);
  const [givenEmailContent, setGivenEmailContent] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGenerateReply = async () => {
    setError(false)

    if(givenEmailContent.length === 0) {
      setError(true);
      setErrorMessage("Please enter email content");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("https://auto-write-server.onrender.com/krutrim/email/generate-reply", {
        emailContent: givenEmailContent,
      });
      if (response.status === 200) {
        setGeneratedReply(response.data.data);
      } else {
        setError(true);
        setErrorMessage("Something went wrong! Please try again later");
      }
    } catch (error) {
      setError(true);
      setErrorMessage("Something went wrong! Please try again later");
      console.log("Error fetching email reply...", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (length) => {
    setReplyLength(length);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(generatedReply[replyLength]);
    setCopied(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }, [copied]);

  return (
    <div className={`App ${darkMode ? "dark" : "light"}`}>
      <div className="toggle-button" onClick={handleToggleDarkMode}>
        {darkMode ? "🌞" : "🌙"}
      </div>
      <h3>AI EMAIL REPLIES 🚀</h3>
      <textarea className="email-input" placeholder="Enter email to which reply has to be sent..." onChange={(e) => setGivenEmailContent(e.target.value)} value={givenEmailContent}></textarea>
      {error && <div className="error-message">{errorMessage}</div>}
      <button disabled={loading ? true : false} className="generate-button" onClick={handleGenerateReply}>
        {loading ? <Loader /> : "Generate reply"}
      </button>

      {!loading && Object.keys(generatedReply).length > 0 && (
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
