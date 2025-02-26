import { useState } from "react";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";
import { Helmet } from "react-helmet-async";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

	return (
		<>
			<Helmet>
				<title>HomePage | Snapzy </title>
			</Helmet>
			<div className="flex-[4_4_0] mx-auto border-r mt-16 border-gray-700 min-h-screen w-full max-w-2xl">
				{/* Header */}
				<div className="flex w-full border-b border-gray-700">
					<div
						className={`flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative text-sm sm:text-base ${feedType === "forYou" ? "font-bold" : ""
							}`}
						onClick={() => setFeedType("forYou")}
					>
						For You
						{feedType === "forYou" && (
							<div className="absolute bottom-0 w-10 h-1 rounded-full bg-yellow-500"></div>
						)}
					</div>
					<div
						className={`flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative text-sm sm:text-base ${feedType === "following" ? "font-bold" : ""
							}`}
						onClick={() => setFeedType("following")}
					>
						Following
						{feedType === "following" && (
							<div className="absolute bottom-0 w-10 h-1 rounded-full bg-yellow-500"></div>
						)}
					</div>
				</div>

				{/* CREATE POST INPUT */}
				<div className="px-2 sm:px-4">
					<CreatePost />
				</div>

				{/* POSTS */}
				<div className="px-2 sm:px-4">
					<Posts feedType={feedType} />
				</div>
			</div>
		</>
	);
};
export default HomePage;
