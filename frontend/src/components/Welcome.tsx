import welcomePic from "../assets/Sudoku-Logo.jpg"
import "./styles/Welcome.css"
import {useState} from "react";

export default function Welcome(){

    const [showCredits, setShowCredits] = useState(false);

    const toggleCredits = () => {
        setShowCredits(prev => !prev);
    };

    return (
        <div>
            <h2>Welcome to Sudoku Animal Hub</h2>
            <p>Click on the Picture or the Play button to start playing!</p>

            <div className="image-wrapper">
                <img
                    src={welcomePic}
                    alt="Welcome to RevealHub"
                    className="logo-welcome"
                />
                <div className="info-icon" onClick={toggleCredits} title="Bildnachweis">i</div>

                {showCredits && (
                    <div className="image-credit">
                        Bild: <a href="https://www.vecteezy.com/vector-art/9377494-sudoku-word-logo-with-toucan-bird" target="_blank" rel="noopener noreferrer">
                        Sudoku word logo</a> von <a href="https://www.vecteezy.com" target="_blank" rel="noopener noreferrer">Vecteezy</a>
                    </div>
                )}
            </div>
        </div>
    );
}