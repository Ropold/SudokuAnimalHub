import axios from "axios";
import {NumberToAnimalMap} from "./model/NumberToAnimalMap.ts";
import {AnimalModel} from "./model/AnimalModel.ts";
import {animalsEnumImages} from "./utils/AnimalEnumImages.ts";
import "./styles/Deck.css";
import * as React from "react";
import {getAnimalEnumDisplayName} from "./utils/getAnimalEnumDisplayName.ts";

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
                        <p>#{number}</p>
                        <p>{getAnimalEnumDisplayName(animal)}</p>
                    </div>
                ))}
            </div>

            {props.user !== "anonymousUser" ? (
                <>
                    <h3 className="margin-top-50">User Deck</h3>
                    <div className="deck-grid">
                        {Object.entries(props.savedDeck).map(([number, animal]) => (
                            <div key={number} className="deck-card">
                                <img
                                    src={animalsEnumImages[animal]}
                                    alt={animal}
                                    className="deck-image"
                                />
                                <p>#{number}</p>
                                <p>{getAnimalEnumDisplayName(animal)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="space-between">
                        <button className="button-group-button" onClick={saveUsersDeck}>
                            Save User Deck
                        </button>
                    </div>
                </>
            ) : (
                <h3 className="margin-top-50">You can save your deck if you login with your GitHub account.</h3>
            )}




        </div>
    );
}