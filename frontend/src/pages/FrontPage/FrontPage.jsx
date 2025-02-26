import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const FrontPage = () => {
    const navigate = useNavigate();

    return (
        <>
        <Helmet>
        <title>Snapzy || a social media platform ...</title>
      </Helmet>
        <div className="flex flex-col items-center justify-center min-h-screen w-full text-center px-6 relative text-white">
            {/* Snapzy Title for Mobile */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 top-6 flex justify-center md:hidden text-4xl font-extrabold text-pink-500 drop-shadow-lg tracking-wide z-10"
            >
                Snapzy
            </motion.div>

            {/* Animated Gradient Heading */}
            <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-400 via-red-500 to-purple-500 bg-clip-text text-transparent py-4 mt-20 md:mt-0 drop-shadow-lg"
            >
                Discover, Connect & Share
            </motion.h1>

            {/* Stylish Paragraph */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="max-w-2xl text-lg sm:text-xl text-gray-200 mt-4 px-4 leading-relaxed tracking-wide drop-shadow-md"
            >
                Step into the world of <span className="text-pink-400 font-semibold">creativity</span> and <span className="text-purple-400 font-semibold">connections</span>.
                Join Snapzy and <strong>explore boundless opportunities</strong> like never before.
            </motion.p>

            {/* Two-Column Layout */}
            <div className="mt-10 flex flex-col md:flex-row items-center justify-center w-full max-w-6xl gap-10 px-6 md:px-10">
                {/* Left Side - Large Heading */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-left md:w-1/2 space-y-4"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 drop-shadow-lg">
                        Unlock Endless Possibilities 🚀
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                        Connect with a thriving community, share your thoughts, and <strong>turn your ideas into reality</strong>.
                    </p>
                    <p className="text-lg sm:text-xl text-gray-400">
                        Be part of something <strong>bigger, better, and bolder</strong>!
                    </p>

                    {/* Button Section */}
                    <div className="relative z-20 flex flex-col items-start space-y-2">
                        <button
                            className="mt-4 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm sm:text-lg font-semibold rounded-full shadow-xl hover:scale-105 transition-transform"
                            onClick={() => {
                                navigate('/login');
                            }}
                        >
                            Get Started <span className="ml-1">🚀</span>
                        </button>
                        <p className="text-gray-300 mt-3">
                            Don't have an account?
                            <Link to="/signup" className="text-blue-400 hover:underline font-medium"> Sign up</Link>
                        </p>
                    </div>
                </motion.div>

                {/* Right Side - Image (Only for large screens) */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hidden lg:flex lg:w-1/2 justify-center"
                >
                    <img
                        src="https://unmistakablecreative.com/wp-content/uploads/2023/09/image-5.png"
                        alt="tech image"
                        className="rounded-xl shadow-lg max-w-full h-60 md:h-80 object-cover"
                    />
                </motion.div>
            </div>
        </div>
        </>
    );
};

export default FrontPage;
