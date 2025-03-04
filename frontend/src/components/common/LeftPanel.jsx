import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const news = [
  "🚀 Breaking News: Snapzy is now live with AI integration!",
  "💡 Tech Update: Gemini API is trending in 2025",
  "🎯 New Feature: Tic Tac Toe Mini Game Added!",
  "🔥 Milestone: SignUp Right Now to explore things!",
  "✨ Stay Tuned: More Exciting Features Coming Soon!",
  "📸 Snapzy introduces Image Upload Feature!",
  "💬 Snapzy's Comment and Like System is now live!",
  "🧠 Ask AI Feature powered by Gemini API is ready to assist!",
  "🎨 Profile Customization Feature is available!",
  "📊 Snapzy's User Engagement at its Peak!"
];

const LeftPanel = () => {
  const [currentNews, setCurrentNews] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNews((prev) => (prev + 1) % news.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:block mt-24 max-w-64 min-h-screen bg-gradient-to-b from-gray-900 to-black border-r border-gray-700 overflow-hidden shadow-xl rounded-xl mr-14">
      <div className="text-white text-3xl font-bold p-6 border-b border-gray-700 text-center tracking-wide uppercase animate-pulse">
        📰 News & Updates
      </div>
      <div className="p-6 h-[60vh] flex flex-col items-center justify-center">
        {news.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={index === currentNews ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className={`text-lg text-gray-300 text-center my-6 ${index === currentNews ? "block" : "hidden"}`}
          >
            {item}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LeftPanel;