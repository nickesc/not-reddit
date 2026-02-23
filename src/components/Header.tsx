import {useState} from "react";
import * as Icons from "./Icons";
import "./Header.css";

function Header({userId, setUserId}: {userId: string | null; setUserId: (userId: string) => void}) {
    const [userIdDraft, setUserIdDraft] = useState<string>("");

    function handleDraftChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUserIdDraft(e.target.value);
        setUserId(e.target.value);
    }

    function openInNewTab(event: React.MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank")?.focus();
    }

    return (
        <header>
            <div className="header-top">
                <a className="header-logo-title" href="https://not-reddit.com" onClick={openInNewTab}>
                    <Icons.Logo />
                    <span className="header-title">not-reddit</span>
                </a>
                <div className="header-login">
                    <label htmlFor="userIdInput">Username</label>
                    <input
                        id="userIdInput"
                        type="text"
                        placeholder="Log in as..."
                        value={userIdDraft}
                        onChange={handleDraftChange}
                    />
                </div>
            </div>
            <div className="card caution-card header-note">
                <strong>Note:</strong> This is an ephemeral session. Your username and posts will be cleared when you
                reload the page.
            </div>
            <div className="header-bottom">
                <p>
                    <i>
                        {userId ? (
                            <>
                                Welcome, <strong>{userId}!</strong>
                            </>
                        ) : (
                            <span className="header-login-prompt">
                                Set your username to login&nbsp;
                                <Icons.LoginIcon />
                            </span>
                        )}
                    </i>
                </p>
                <p>After setting your username, create a new post to get started.</p>
                <p>
                    Try liking, replying, and editing posts. Then change your username, and interact with the app as a
                    different user.
                </p>
            </div>
        </header>
    );
}

export default Header;
