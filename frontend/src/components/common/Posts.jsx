import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const Posts = ({ feedType, username, userId }) => {
	const POST_ENDPOINT = useMemo(() => {
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
	}, [feedType, username, userId]);

	const {
		data: posts,
		isLoading,
		refetch,
		isRefetching,
		error,
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
	});

	if (error) {
		return <p className="text-center my-4 text-red-500">Error: {error.message}</p>;
	}

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}

			{!isLoading && !isRefetching && posts?.length === 0 && (
				<p className='text-center my-4'>No posts in this tab. Switch 👻</p>
			)}

			{!isLoading && !isRefetching && posts && (
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
