import axios from "axios";
import {NumberToAnimalMap} from "./model/NumberToAnimalMap.ts";
import {AnimalModel} from "./model/AnimalModel.ts";
import {animalsEnumImages} from "./utils/AnimalEnumImages.ts";
import "./styles/Deck.css";
import * as React from "react";

type DeckProps = {
    user: string;
    activeAnimals: AnimalModel[];
    tempDeck: NumberToAnimalMap;
    setTempDeck: React.Dispatch<React.SetStateAction<NumberToAnimalMap>>;
    savedDeck: NumberToAnimalMap;
    setSavedDeck: React.Dispatch<React.SetStateAction<NumberToAnimalMap>>;
}

export default function Deck(props: Readonly<DeckProps>) {

    function saveUsersDeck() {
        axios
            .post("/api/users/numbers-to-animal", props.tempDeck)
            .then(() => {
                props.setSavedDeck(props.tempDeck);
            })
            .catch((error) => {
                console.error("Error saving deck:", error);
            });
    }

    return (
        <div>
            <h3>Temp Deck</h3>
            <div className="deck-grid">
                {Object.entries(props.tempDeck).map(([number, animal]) => (
                    <div key={number} className="deck-card">
                        <img
                            src={animalsEnumImages[animal]}
                            alt={animal}
                            className="deck-image"
                        />
                        <p className="deck-number">#{number}</p>
                        <p className="deck-animal">{animal}</p>
                    </div>
                ))}
            </div>

            {props.user !== "anonymousUser" ? (
                <div className="deck-grid">
                    {Object.entries(props.savedDeck).map(([number, animal]) => (
                        <div key={number} className="deck-card">
                            <img
                                src={animalsEnumImages[animal]}
                                alt={animal}
                                className="deck-image"
                            />
                            <p className="deck-number">#{number}</p>
                            <p className="deck-animal">{animal}</p>
                        </div>
                    ))}
                    <div>
                    <button className="button-group-button" onClick={saveUsersDeck}>
                        Save Deck
                    </button>
                    </div>
                </div>

            ) : (
                <p>You can save your deck if you login with your GitHub account.</p>
            )}




        </div>
    );
}