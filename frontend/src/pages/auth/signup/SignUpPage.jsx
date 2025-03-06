import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { MdOutlineMail, MdPassword, MdDriveFileRenameOutline } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "https://snapzy-backend.onrender.com";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      try {
        const res = await fetch(`${API_URL}/api/auth/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, username, fullName, password }),
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create account");

        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/homepage");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Helmet>
        <title>Signup Page | Snapzy </title>
      </Helmet>
      <div className="h-screen w-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-900 via-black to-gray-900 px-6 py-10 md:px-18 md:py-20">
        {/* Left Section - Headings and Description */}
        <motion.div 
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="md:flex-1 text-white rounded-l-lg flex flex-col justify-center items-start p-10 md:p-16 text-center md:text-left shadow-2xl bg-opacity-80 backdrop-blur-lg bg-gradient-to-r from-indigo-800 to-purple-800">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 md:mb-4 animate-pulse">Join Snapzy Today 😎</h1>
          <p className="text-md md:text-lg max-w-md">
            Create your account and start sharing your moments with the world. Experience a new level of social connection!
          </p>
        </motion.div>

        {/* Right Section - Sign Up Form */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="md:flex-1 flex justify-center items-center bg-opacity-80 backdrop-blur-lg rounded-r-lg mt-6 md:mt-0">
          <form className="flex flex-col gap-5 bg-gray-800 p-6 md:p-10 rounded-xl shadow-2xl w-full max-w-[380px]" onSubmit={handleSubmit}>
            <h2 className="text-3xl font-bold text-center text-white mb-4">Sign Up</h2>

            <label className="input input-bordered flex items-center gap-2 bg-gray-700 text-white rounded-lg p-3 w-full">
              <MdOutlineMail className="text-xl" />
              <input
                type="email"
                className="grow bg-transparent outline-none"
                placeholder="Email"
                name="email"
                onChange={handleInputChange}
                value={formData.email}
                required
              />
            </label>

            <div className="flex flex-col flex-wrap md:flex-row gap-4">
              <label className="input input-bordered flex items-center gap-2 flex-1 bg-gray-700 text-white rounded-lg p-3">
                <FaUser className="text-xl" />
                <input
                  type="text"
                  className="grow bg-transparent outline-none"
                  placeholder="Username"
                  name="username"
                  onChange={handleInputChange}
                  value={formData.username}
                  required
                />
              </label>
              <label className="input input-bordered flex items-center gap-2 flex-1 bg-gray-700 text-white rounded-lg p-3">
                <MdDriveFileRenameOutline className="text-xl" />
                <input
                  type="text"
                  className="grow bg-transparent outline-none"
                  placeholder="Full Name"
                  name="fullName"
                  onChange={handleInputChange}
                  value={formData.fullName}
                  required
                />
              </label>
            </div>

            <label className="input input-bordered flex items-center gap-2 bg-gray-700 text-white rounded-lg p-3 w-full">
              <MdPassword className="text-xl" />
              <input
                type="password"
                className="grow bg-transparent outline-none"
                placeholder="Password"
                name="password"
                onChange={handleInputChange}
                value={formData.password}
                required
              />
            </label>

            <button className="btn bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-300">
              {isPending ? "Loading..." : "Sign Up"}
            </button>
            {isError && <p className="text-red-500 text-sm text-center">{error.message}</p>}

            <div className="text-center">
              <p className="text-white">Already have an account?</p>
              <Link to="/login">
                <button className="mt-3 border border-indigo-400 text-indigo-400 hover:bg-indigo-400 hover:text-black py-3 rounded-lg w-full transition-all">
                  Sign In
                </button>
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default SignUpPage;