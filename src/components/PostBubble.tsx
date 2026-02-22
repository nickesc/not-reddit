import {useState} from "react";
import type {NewPostParams, Post} from "../types/index";
import PostForm from "./PostForm";
import * as Icons from "./Icons";
import "./PostBubble.css";

function PostBubble({
    post,
    userId,
    repliesLength,
    deletePost,
    editPost,
    addPost,
    likePost,
}: {
    post: Post;
    userId: string | null;
    repliesLength: number;
    deletePost: (id: string) => Promise<boolean>;
    editPost: (id: string, content: string) => Promise<boolean>;
    addPost: (newPost: NewPostParams) => Promise<boolean>;
    likePost: (id: string) => Promise<boolean>;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingDraft, setEditingDraft] = useState(post.content);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isReplying, setIsReplying] = useState(false);

    function handleEdit() {
        setIsEditing(true);
    }

    function validateWritePermission(): boolean {
        return userId === post.author;
    }

    function validateInteractionPermission(): boolean {
        return userId !== null;
    }

    async function handleSave(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const content = editingDraft.trim();
        if (!content) {
            setErrorMessage("Content is required");
            return;
        }
        const status = await editPost(post.id, content);
        if (status) {
            setIsEditing(false);
            setEditingDraft(content);
            setErrorMessage(null);
        } else {
            setErrorMessage("Failed to edit post");
        }
    }

    function handleCancel(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsEditing(false);
        setEditingDraft(post.content);
        setErrorMessage(null);
    }

    function handleContentChange(event: React.ChangeEvent<HTMLInputElement>) {
        setEditingDraft(event.target.value);
        setErrorMessage(null);
    }

    return (
        <div className="post-bubble">
            <div className="post-content">
                {isEditing && validateWritePermission() ? (
                    <form id={`editForm-${post.id}`} onSubmit={handleSave} onReset={handleCancel}>
                        <input value={editingDraft} onChange={handleContentChange} placeholder="Edit post" />
                        {errorMessage && <p className="error">{errorMessage}</p>}
                    </form>
                ) : (
                    <p>{post.content}</p>
                )}
                <div className="post-author-timestamp">
                    <p className="post-author">
                        <strong>{post.author}</strong>
                    </p>

                    <p className="post-timestamp">
                        <small>
                            {new Date(post.created).toLocaleString() +
                                (post.edited ? ` (edited ${new Date(post.edited).toLocaleString()})` : "")}
                        </small>
                    </p>
                </div>
                {!validateInteractionPermission() && (
                    <div className="post-stats-container">
                        <div className="post-stats">
                            <p className="post-likes">
                                <Icons.LikeIcon />
                                {post.likes.length}
                            </p>
                        </div>
                        <div className="post-stats">
                            <p className="post-replies">
                                <Icons.ReplyIcon />
                                {repliesLength}
                            </p>
                        </div>
                    </div>
                )}
            </div>
            {validateInteractionPermission() && (
                <>
                    <div className="post-actions">
                        <button onClick={() => likePost(post.id)} aria-label="Like post" className="secondary-button">
                            {post.likes.includes(userId!) ? <Icons.UnlikeIcon /> : <Icons.LikeIcon />}
                            {post.likes.length > 0 ? post.likes.length : ""}
                        </button>
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            aria-label="Reply to post"
                            className="secondary-button"
                        >
                            <Icons.ReplyIcon />
                            {repliesLength > 0 ? repliesLength : ""}
                        </button>
                        {validateWritePermission() && (
                            <>
                                <button
                                    onClick={() => deletePost(post.id)}
                                    aria-label="Delete post"
                                    className="secondary-button"
                                >
                                    <Icons.DeleteIcon />
                                </button>
                                {!isEditing && (
                                    <button onClick={handleEdit} aria-label="Edit post" className="secondary-button">
                                        <Icons.EditIcon />
                                    </button>
                                )}
                                {isEditing && (
                                    <>
                                        <button
                                            type="submit"
                                            form={`editForm-${post.id}`}
                                            aria-label="Save post"
                                            className="secondary-button"
                                        >
                                            <Icons.SaveIcon />
                                        </button>
                                        <button
                                            type="reset"
                                            form={`editForm-${post.id}`}
                                            aria-label="Cancel edit"
                                            className="secondary-button"
                                        >
                                            <Icons.CancelIcon />
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                    {isReplying && <PostForm addPost={addPost} parent={post.id} userId={userId} />}
                </>
            )}
        </div>
    );
}

export default PostBubble;
