import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";

const API_BASE_URL = "http://localhost:5002";

const AiAskModal = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
      setResponse(""); // ✅ Clear response when modal closes
      setError(""); // ✅ Clear error when modal closes
      setQuestion(""); // ✅ Clear input field when modal closes
    }

    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setResponse("");
    setError("");

    try {
      const endpoint = new URL("/api/ai/ask", API_BASE_URL).toString();
      console.log("API Endpoint:", endpoint);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format.");
      }

      const data = await res.json();
      setResponse(data?.response || "Sorry, I couldn't process your question.");
    } catch (err) {
      console.error("Error fetching AI response:", err);
      setError("An error occurred while fetching the response.");
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-gray-900 w-[90%] max-w-lg p-6 rounded-lg shadow-lg relative max-h-[80vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <IoClose size={24} />
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-bold mb-4 text-white text-center">Ask AI</h2>

        {/* Input Field */}
        <input
          type="text"
          placeholder="Ask your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border border-gray-600 bg-gray-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />

        {/* Submit Button */}
        <button
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
          onClick={handleAsk}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Thinking...
            </>
          ) : (
            "Ask"
          )}
        </button>

        {/* Scrollable Response Section */}
        {(response || error) && (
          <div className="mt-4 p-3 border border-gray-700 bg-gray-800 text-gray-300 rounded-md max-h-48 overflow-y-auto">
            {response && <p>{response}</p>}
            {error && <p className="text-red-400">{error}</p>}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AiAskModal;
