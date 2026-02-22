import type {Post} from "../types/index";
import PostBubble from "./PostBubble";
import type {NewPostParams} from "../types/index";
import {useState} from "react";
import * as Icons from "./Icons";
import "./PostList.css";

function PostList({
    posts,
    rootPost,
    userId,
    deletePost,
    editPost,
    addPost,
    likePost,
}: {
    posts: Post[];
    rootPost: string | null;
    userId: string | null;
    deletePost: (id: string) => Promise<boolean>;
    editPost: (id: string, content: string) => Promise<boolean>;
    addPost: (newPost: NewPostParams) => Promise<boolean>;
    likePost: (id: string) => Promise<boolean>;
}) {
    const [sortNewToOld, setSortNewToOld] = useState(true);
    const childPosts = posts
        .filter((p) => p.parent === rootPost)
        .sort((a, b) => {
            return sortNewToOld ? b.created - a.created : a.created - b.created;
        });

    if (childPosts.length === 0) {
        return rootPost ? null : <p>No posts yet</p>;
    }

    async function handleAddPost(newPost: NewPostParams) {
        const status = await addPost(newPost);

        if (status) {
            console.log("Post added", newPost);
        } else {
            console.error("Failed to add post");
        }
        return status;
    }

    function getRepliesLength(post: Post): number {
        return posts.filter((p) => p.parent === post.id).length;
    }

    return (
        <div className="post-list">
            <div className="post-list-header">
                Sort {rootPost ? "replies" : "posts"}:{" "}
                <button
                    onClick={() => setSortNewToOld(!sortNewToOld)}
                    aria-label="Sort posts"
                    className="tertiary-button"
                >
                    {sortNewToOld ? <Icons.SortUpIcon /> : <Icons.SortDownIcon />}
                </button>
            </div>
            <ul className="post-list-body">
                {childPosts.map((p) => {
                    return (
                        <li className="content-card" key={p.id}>
                            <PostBubble
                                post={p}
                                userId={userId}
                                repliesLength={getRepliesLength(p)}
                                deletePost={deletePost}
                                editPost={editPost}
                                addPost={handleAddPost}
                                likePost={likePost}
                            />
                            <PostList
                                posts={posts}
                                rootPost={p.id}
                                userId={userId}
                                deletePost={deletePost}
                                editPost={editPost}
                                addPost={addPost}
                                likePost={likePost}
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default PostList;
