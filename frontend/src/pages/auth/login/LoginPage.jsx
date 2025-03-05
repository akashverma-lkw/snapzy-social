import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IoMdLogIn } from "react-icons/io";

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
        credentials: "include", // ✅ Ensure JWT is sent with requests
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid username or password");
      }
      return data; // 🔥 Return data so it will be available in onSuccess

    },
    onSuccess: (data) => {
      console.log("Login Success ✅:", data); // Check yeh console aa raha hai?
      console.log("Token:", data.token); // Yeh token aa raha hai ya undefined?
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      if (data.token) {
        localStorage.setItem("authUser", JSON.stringify(data.token));
      }
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
      <div className="h-screen w-screen flex flex-col md:flex-row px-6 py-10 md:px-18 md:py-20">
        {/* Left Section */}
        <div className="md:flex-1 bg-indigo-800 text-white rounded-l-lg flex flex-col justify-center items-start p-10 md:p-16 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl text-slate-300 font-bold mb-3 md:mb-4">Welcome to Snapzy</h1>
          <p className="text-md md:text-lg text-slate-400 max-w-md">
            Connect with friends 😍, share your moments 🤩, and experience social media like never before.
          </p>
          <button
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-all"
            onClick={() => navigate("/")}
          >
            HomePage
          </button>
        </div>

        {/* Right Section - Login Form */}
        <div className="md:flex-1 flex justify-center items-center rounded-r-lg bg-gray-900 mt-6 md:mt-0">
          <form className="flex flex-col gap-5 bg-gray-800 p-6 md:p-10 rounded-xl shadow-lg w-full max-w-[380px]" onSubmit={handleSubmit}>
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center">Login</h2>

            <label className="input input-bordered flex items-center gap-2 bg-gray-700 text-white rounded-lg p-3 w-full">
              <MdOutlineMail className="text-xl" />
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

            <button className="btn bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg" disabled={isPending}>
              <div className="flex items-center justify-center gap-1">
                {isPending ? "Logging in..." : "Login"} <IoMdLogIn className="w-5 h-4" />
              </div>
            </button>

            {isError && <p className="text-red-500 text-sm">{error?.message || "An error occurred"}</p>}

            <div className="text-center">
              <p className="text-white">Don't have an account?</p>
              <Link to="/signup">
                <button className="btn bg-transparent border-white text-white hover:bg-white hover:text-black py-3 rounded-lg w-full mt-2">
                  Sign Up
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
