import {useNavigate} from "react-router-dom";
import axios from "axios";

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
           <h3>Navbar</h3>

            {props.user !== "anonymousUser" ? (
                <>
                    <button className="button-group-button" onClick={() => navigate("/profile")}>Profile</button>
                    <button className="button-group-button" onClick={logoutFromGithub}>Logout</button>
                </>
            ) : (
                <button className="button-group-button" onClick={loginWithGithub}>Login with GitHub</button>
            )}
        </nav>
    )
}