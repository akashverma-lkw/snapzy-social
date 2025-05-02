import { Navigate, Route, Routes, Link } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import FrontPage from "./pages/FrontPage/FrontPage";

import Navbar from "./components/common/Navbar";
import RightPanel from "./components/common/RightPanel";
import LeftPanel from "./components/common/LeftPanel";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";

const API_URL = import.meta.env.VITE_API_URL || "https://snapzy-backend.onrender.com";


function App() {
    const { data: authUser, isLoading } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            try {
                const res = await fetch(`${VITE_API_URL}/api/auth/me`);
                const data = await res.json();
                if (data.error) return null;
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
        retry: false,
    });

    if (isLoading) {
        return (
            <div className='h-screen flex justify-center items-center'>
                <LoadingSpinner size='lg' />
            </div>
        );
    }

    return (
        <div className='flex max-w-7xl mx-auto'>
            {authUser && <Navbar />}
            {authUser && <LeftPanel />}
            <HelmetProvider>
            <Routes>
                <Route path='/' element={<FrontPage />} />
                <Route path='/homepage' element={<HomePage />} />
                <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/homepage' />} />
                <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/homepage' />} />
                <Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' />} />
                <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
            </Routes>
            </HelmetProvider>
            {authUser && <RightPanel />}
            <Toaster />
        </div>
    );
}

export default App;
