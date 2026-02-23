import type {NewPostParams} from "../types/index";
import {useState} from "react";
import * as Icons from "./Icons";
import "./PostForm.css";

function PostForm({
    addPost,
    parent,
    userId,
}: {
    addPost: (newPost: NewPostParams) => Promise<boolean>;
    parent: string | null;
    userId: string | null;
}) {
    const [contentDraft, setContentDraft] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    function handleContentChange(event: React.ChangeEvent<HTMLInputElement>) {
        setContentDraft(event.target.value);
        setErrorMessage(null);
    }

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const content = contentDraft.trim();
        if (!userId) {
            setErrorMessage("User ID is required");
            return;
        }
        if (!content) {
            setErrorMessage("Content is required");
            return;
        }
        const status = await addPost({content: content, parentId: parent});
        if (status) {
            setContentDraft("");
            setErrorMessage(null);
        } else {
            setErrorMessage("Failed to add post");
        }
    }

    function handleReset(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        setContentDraft("");
        setErrorMessage(null);
    }

    const replyLabel = parent ? "reply" : "post";

    return (
        <>
            <form className="post-form" onSubmit={handleSubmit} onReset={handleReset}>
                <input
                    name="newPostText"
                    placeholder={`${replyLabel.charAt(0).toUpperCase() + replyLabel.slice(1)} text`}
                    value={contentDraft}
                    onChange={handleContentChange}
                    autoComplete="off"
                />
                <button
                    type="reset"
                    aria-label={`Reset ${replyLabel}`}
                    className="secondary-button delete-button"
                    disabled={!contentDraft}
                >
                    <Icons.CancelIcon />
                </button>
                <button
                    type="submit"
                    aria-label={`Submit ${replyLabel}`}
                    className="primary-button submit-button"
                    disabled={!contentDraft.trim() || !userId}
                >
                    <Icons.SubmitIcon />
                </button>
            </form>
            {errorMessage && <p className="error">{errorMessage}</p>}
        </>
    );
}

export default PostForm;
