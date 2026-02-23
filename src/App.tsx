import Header from "./components/Header";
import Footer from "./components/Footer";
import PostList from "./components/PostList";
import "./App.css";
import {useState} from "react";
import type {Post, NewPostParams} from "./types/index";
import PostForm from "./components/PostForm";

function App() {
    const [userId, setUserId] = useState<string | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);

    function validatePostPermission(postId: string, ownershipRequired: boolean): boolean {
        const post = posts.find((p) => p.id === postId);
        if (!post) {
            console.error("Post not found");
            return false;
        }
        if (ownershipRequired && userId !== post.author) {
            console.error("User ID does not match author");
            return false;
        }

        return true;
    }

    function updateUserId(newUserId: string) {
        const trimmedUserId = newUserId.trim() || null;
        setUserId(trimmedUserId);
        console.log("userId changed to", trimmedUserId);
    }

    async function addPost({content, parentId}: NewPostParams): Promise<boolean> {
        if (!userId) {
            console.error("User ID is required to add a post");
            return false;
        }

        if (parentId !== null && !posts.some((p) => p.id === parentId)) {
            console.error("Parent post not found");
            return false;
        }

        const newPost: Post = {
            id: crypto.randomUUID(), // uuid
            author: userId, // current userID
            content: content, // text of the post
            likes: [], // list of userIDs that liked the post
            created: Date.now(), // timestamp of post creation
            edited: null, // timestamp of last edit
            parent: parentId, // the id of a parent message, if it exists
        };

        setPosts((prev) => {
            console.log("posts updated to", [newPost, ...prev]);
            return [newPost, ...prev];
        });
        return true;
    }

    async function deletePost(id: string): Promise<boolean> {
        const allowed = validatePostPermission(id, true);
        if (!allowed) {
            console.error("User does not have permission to delete post");
            return false;
        }
        console.log("deleting post", id);
        setPosts((prev) => prev.filter((p) => p.id !== id));
        return true;
    }

    async function editPost(id: string, content: string): Promise<boolean> {
        const allowed = validatePostPermission(id, true);
        if (!allowed) {
            console.log("User does not have permission to edit post");
            return false;
        }
        setPosts((prev) => prev.map((p) => (p.id === id ? {...p, content: content, edited: Date.now()} : p)));
        console.log("editing post", id, content);
        return true;
    }

    async function likePost(id: string): Promise<boolean> {
        if (!userId) {
            console.error("User ID is required to like a post");
            return false;
        }

        const allowed = validatePostPermission(id, false);
        if (!allowed) {
            console.error("User does not have permission to like post");
            return false;
        }
        if (posts.find((p) => p.id === id)?.likes.includes(userId!)) {
            setPosts((prev) =>
                prev.map((p) => (p.id === id ? {...p, likes: p.likes.filter((u) => u !== userId!)} : p)),
            );
        } else {
            setPosts((prev) => prev.map((p) => (p.id === id ? {...p, likes: [...p.likes, userId!]} : p)));
        }
        return true;
    }

    return (
        <>
            <Header userId={userId} setUserId={updateUserId} />
            <main>
                <PostList
                    posts={posts}
                    rootPost={null}
                    userId={userId}
                    deletePost={deletePost}
                    editPost={editPost}
                    addPost={addPost}
                    likePost={likePost}
                />{" "}
                {/* use null to indicate no root post */}
                <PostForm addPost={addPost} parent={null} userId={userId} /> {/* use null to indicate no parent post */}
            </main>
            <Footer />
        </>
    );
}

export default App;
