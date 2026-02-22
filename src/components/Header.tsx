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
                        placeholder="Set User ID"
                        value={userIdDraft}
                        onChange={handleDraftChange}
                    />
                </div>
            </div>
            <div className="header-bottom">
                <p>
                    {userId ? (
                        <strong>Welcome, {userId}!</strong>
                    ) : (
                        <span className="header-login-prompt">
                            Set your username to login&nbsp;
                            <Icons.LoginIcon />
                        </span>
                    )}
                </p>
            </div>
        </header>
    );
}

export default Header;
