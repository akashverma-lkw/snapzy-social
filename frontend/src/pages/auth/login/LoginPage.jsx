import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IoMdLogIn } from "react-icons/io";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

const LoginPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { mutate: loginMutation, isPending, isError, error } = useMutation({
    mutationFn: async ({ username, password }) => {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid username or password");
      }
      return data;
    },
    onSuccess: (data) => {
      console.log("Login Success ✅:", data);
      console.log("Token:", data.token);
      queryClient.setQueryData(["user"], data.user);
      queryClient.setQueryData(["token"], data.token);
      navigate("/homepage");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Helmet>
        <title>Login Page | Snapzy</title>
      </Helmet>
      <div className="h-screen w-screen flex flex-col md:flex-row px-6 py-10 md:px-18 md:py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="md:flex-1 bg-gradient-to-r from-indigo-800 to-purple-800 text-white rounded-l-lg flex flex-col justify-center items-start p-10 md:p-16 text-center md:text-left shadow-2xl"
        >
          <h1 className="text-5xl md:text-5xl font-extrabold mb-3 md:mb-4 animate-pulse">Welcome to Snapzy</h1>
          <p className="text-md md:text-lg text-slate-300 max-w-md leading-relaxed">
            Connect with friends 😍, share your moments 🤩, and experience social media like never before.
          </p>
          <button
            className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform"
            onClick={() => navigate("/")}
          >
            HomePage
          </button>
        </motion.div>

        {/* Right Section - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="md:flex-1 flex justify-center items-center rounded-r-lg bg-black bg-opacity-60 backdrop-blur-lg shadow-2xl mt-6 md:mt-0"
        >
          <form className="flex flex-col gap-6 bg-gray-800 p-8 md:p-12 rounded-xl shadow-xl w-full max-w-[400px]" onSubmit={handleSubmit}>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Login</h2>

            <label className="input flex items-center gap-3 bg-gray-700 text-white rounded-lg p-4 w-full">
              <MdOutlineMail className="text-2xl text-indigo-400" />
              <input
                type="text"
                className="grow bg-transparent outline-none placeholder-gray-400"
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
                required
              />
            </label>

            <label className="input flex items-center gap-3 bg-gray-700 text-white rounded-lg p-4 w-full">
              <MdPassword className="text-2xl text-indigo-400" />
              <input
                type="password"
                className="grow bg-transparent outline-none placeholder-gray-400"
                placeholder="Password"
                name="password"
                onChange={handleInputChange}
                value={formData.password}
                required
              />
            </label>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg"
              disabled={isPending}
            >
              <div className="flex items-center justify-center gap-2">
                {isPending ? "Logging in..." : "Login"} <IoMdLogIn className="w-5 h-5" />
              </div>
            </motion.button>

            {isError && <p className="text-red-500 text-center">{error?.message || "An error occurred"}</p>}

            <div className="text-center">
              <p>Don't have an account?</p>
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="mt-3 border border-indigo-400 text-indigo-400 hover:bg-indigo-400 hover:text-black py-3 rounded-lg w-full transition-all"
                >
                  Sign Up
                </motion.button>
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;