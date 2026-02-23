import "./Footer.css";

function Footer() {
    function openInNewTab(event: React.MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank")?.focus();
    }

    return (
        <footer>
            <p>
                <small>
                    <a href="https://not-reddit.com" onClick={openInNewTab}>
                        OC do not steal!
                    </a>{" "}
                    Not affiliated with Reddit.
                </small>
            </p>
        </footer>
    );
}

export default Footer;
