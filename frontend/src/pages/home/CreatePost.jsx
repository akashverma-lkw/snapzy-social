import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";

const API_URL = import.meta.env.VITE_API_URL;

const CreatePost = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const imgRef = useRef(null);

	const { data: authUser } = useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
			const res = await fetch(`${API_URL}/api/auth/user`, {
				credentials: "include",
			});
			if (!res.ok) throw new Error("Failed to fetch user data");
			return res.json();
		},
	});

	const queryClient = useQueryClient();

	const {
		mutate: createPost,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: async ({ text, img }) => {
			try {
				const res = await fetch(`${API_URL}/api/posts/create`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text, img }),
					credentials: "include", // ✅ Ensure JWT is sent with requests
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error.message);
			}
		},

		onSuccess: () => {
			setText("");
			setImg(null);
			toast.success("Post created successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		createPost({ text, img });
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	// Function to handle emoji selection
	const handleEmojiClick = (emojiObject) => {
		setText((prevText) => prevText + emojiObject.emoji);
		setShowEmojiPicker(false);
	};

	return (
		<div className="flex p-4 items-start gap-4 mt-4 border-b border-gray-700 w-full max-w-md mx-auto px-2 sm:px-4 relative">
			<div className="avatar">
				<div className="w-8 sm:w-10 rounded-full">
					<img src={authUser?.profileImg || "/avatar-placeholder.png"} alt="User Avatar" />
				</div>
			</div>
			<form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
				<textarea
					className="textarea w-full p-0 text-base sm:text-lg resize-none border-none focus:outline-none border-gray-800"
					placeholder="What is happening?!"
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				{img && (
					<div className="relative w-64 sm:w-72 mx-auto">
						<IoCloseSharp
							className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
						/>
						<img src={img} className="w-full h-64 sm:h-72 object-contain rounded" alt="Selected" />
					</div>
				)}

				<div className="flex justify-between border-t py-2 border-t-gray-700 relative">
					<div className="flex gap-2 mt-4 items-center">
						<CiImageOn
							className="fill-primary w-6 h-6 cursor-pointer"
							onClick={() => imgRef.current.click()}
						/>
						<BsEmojiSmileFill
							className="fill-primary w-5 h-5 cursor-pointer"
							onClick={() => setShowEmojiPicker((prev) => !prev)}
						/>
					</div>
					<input type="file" accept="image/*" hidden ref={imgRef} onChange={handleImgChange} />
					<button className="btn btn-primary rounded-full mt-4 btn-sm text-white px-4" disabled={isPending}>
						{isPending ? "Posting..." : "Post"}
					</button>
				</div>

				{/* Emoji Picker */}
				{showEmojiPicker && (
					<div className="absolute bottom-16 top-24 left-0 sm:left-auto sm:bottom-12 z-10">
						<EmojiPicker onEmojiClick={handleEmojiClick} />
					</div>
				)}

				{isError && <div className="text-red-500">{error?.message || "Failed to create post"}</div>}
			</form>
		</div>
	);
};

export default CreatePost;
