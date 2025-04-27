import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const Posts = ({ feedType, username, userId }) => {
	const getPostEndpoint = () => {
		switch (feedType) {
			case "forYou":
				return `${API_URL}/api/posts/all`;
			case "following":
				return `${API_URL}/api/posts/following`;
			case "posts":
				return `${API_URL}/api/posts/user/${username}`;
			case "likes":
				return `${API_URL}/api/posts/likes/${userId}`;
			default:
				return `${API_URL}/api/posts/all`;
		}
	};

	const POST_ENDPOINT = getPostEndpoint();

	// ✅ Check if user is authenticated first
	const { data: authUser, isLoading: authLoading } = useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
			const res = await fetch(`${API_URL}/api/auth/me`, { credentials: "include" });
			if (!res.ok) throw new Error("Not authenticated");
			return res.json();
		},
		retry: false,
	});

	// ✅ Now fetch posts, but only after authUser is loaded
	const {
		data: posts,
		isLoading: postsLoading,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ["posts", feedType, username, userId],
		queryFn: async () => {
			const res = await fetch(POST_ENDPOINT, {
				method: "GET",
				credentials: "include",
			});
			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Something went wrong");
			}

			return data;
		},
		enabled: !!authUser, // ✅ only fetch posts if user is authenticated
	});

	useEffect(() => {
		if (authUser) {
			refetch();
		}
	}, [feedType, refetch, username, authUser]);

	if (authLoading) return null; // or show loading

	return (
		<>
			{(postsLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!postsLoading && !isRefetching && posts?.length === 0 && (
				<p className='text-center my-4'>No posts in this tab. Switch 👻</p>
			)}
			{!postsLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post?._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};

export default Posts;
