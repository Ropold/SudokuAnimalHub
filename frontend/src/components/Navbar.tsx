import {useNavigate} from "react-router-dom";
import axios from "axios";
import "./styles/Buttons.css";
import "./styles/Navbar.css";
import headerLogo from "../assets/Small-Sudoko-Logo.jpg"
import allAnimalsLogo from "../assets/all-animals-logo.jpg"
import deckLogo from "../assets/game-deck-logo.jpg"
import highScoreLogo from "../assets/highscore-logo.jpg"

type NavbarProps = {
    getUser: () => void;
    getUserDetails: () => void;
    user: string;
}

export default function Navbar(props: Readonly<NavbarProps>) {

    const navigate = useNavigate();

    function loginWithGithub() {
        const host = window.location.host === "localhost:5173" ? "http://localhost:8080" : window.location.origin;
        window.open(host + "/oauth2/authorization/github", "_self");
    }

    function logoutFromGithub() {
        axios
            .post("/api/users/logout")
            .then(() => {
                props.getUser();
                props.getUserDetails();
                navigate("/");
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    }

    return (
        <nav className="navbar">
            <button className="button-group-button" onClick={() => navigate("/")}>Home</button>
            <div
                className="clickable-header"
                id="clickable-header-play"
                onClick={() => {
                    navigate("/play");
                }}
            >
                <h2 className="header-title">Play</h2>
                <img src={headerLogo} alt="Sudoku Animal Hub Logo" className="logo-image" />
            </div>

            <div
                className="clickable-header"
                onClick={() => {
                    navigate("/deck");
                }}
            >
                <h2 className="header-title">Deck</h2>
                <img src={deckLogo} alt="Deck Logo" className="logo-image" />
            </div>

            <div
                className="clickable-header"
                onClick={() => {
                    navigate("/list-of-all-animals");
                }}
            >
                <h2 className="header-title">User Animals</h2>
                <img src={allAnimalsLogo} alt="All Animals Logo" className="logo-image" />
            </div>

            <div
                className="clickable-header"
                id="button-high-score"
                onClick={() => {
                    navigate("/high-score");
                }}
            >
                <h2 className="header-title">High Score</h2>
                <img src={highScoreLogo} alt="High Score Logo" className="logo-image" />
            </div>


            {props.user !== "anonymousUser" ? (
                <>
                    <button id="button-profile" onClick={() => navigate("/profile")}>Profile</button>
                    <button className="button-group-button" onClick={logoutFromGithub}>Logout</button>
                </>
            ) : (
                <button className="button-group-button" onClick={loginWithGithub}>Login with GitHub</button>
            )}
        </nav>
    )
}