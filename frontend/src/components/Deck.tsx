import axios from "axios";
import {NumberToAnimalMap} from "./model/NumberToAnimalMap.ts";
import {AnimalModel} from "./model/AnimalModel.ts";
import {animalsEnumImages} from "./utils/AnimalEnumImages.ts";
import "./styles/Deck.css";
import * as React from "react";
import {getAnimalEnumDisplayName} from "./utils/getAnimalEnumDisplayName.ts";
import {useEffect, useState} from "react";
import AnimalSelectPopup from "./AnimalSelectPopup.tsx";
import {AnimalEnum} from "./model/AnimalEnum.ts";

type DeckProps = {
    user: string;
    activeAnimals: AnimalModel[];
    tempDeck: NumberToAnimalMap;
    setTempDeck: React.Dispatch<React.SetStateAction<NumberToAnimalMap>>;
    savedDeck: NumberToAnimalMap;
    setSavedDeck: React.Dispatch<React.SetStateAction<NumberToAnimalMap>>;
}

export default function Deck(props: Readonly<DeckProps>) {
    const [popupTempDeckNumber, setPopupTempDeckNumber] = useState<number | null>(null);
    const [popupSavedDeckNumber, setPopupSavedDeckNumber] = useState<number | null>(null);
    const [savedPopup, setSavedPopup] = useState<boolean>(false);


    function saveUsersDeck(deck: NumberToAnimalMap) {
        axios
            .post("/api/users/numbers-to-animal", deck)
            .then(() => {
                props.setSavedDeck(deck);
                setSavedPopup(true);
            })
            .catch((error) => {
                console.error("Error saving deck:", error);
            });
    }


    useEffect(() => {
        if(savedPopup) {
            setTimeout(() => {
                setSavedPopup(false);
            }, 2000);
        }
    }, [savedPopup]);

    return (
        <div>
            <h3>Temp Deck</h3>
            <div className="deck-grid">
                {Object.entries(props.tempDeck).map(([number, animal]) => {
                    const isUserAnimal = typeof animal === "string" && animal.startsWith("https://");
                    const imageUrl = isUserAnimal ? animal : animalsEnumImages[animal as AnimalEnum];

                    const matchedAnimal = isUserAnimal
                        ? props.activeAnimals.find((a) => a.imageUrl === animal)
                        : null;

                    const name = isUserAnimal
                        ? matchedAnimal?.name || "Custom Animal"
                        : getAnimalEnumDisplayName(animal as AnimalEnum);

                    return (
                        <div key={number} className="deck-card">
                            <img
                                src={imageUrl}
                                alt={name}
                                className="deck-image"
                                onClick={() => setPopupTempDeckNumber(Number(number))}
                            />
                            <p>#{number}</p>
                            <p>{name}</p>
                        </div>
                    );
                })}
            </div>



            {props.user !== "anonymousUser" ? (
                <>
                    <h3 className="margin-top-50">User Deck</h3>
                    <div className="deck-grid">
                        {Object.entries(props.savedDeck).map(([number, animal]) => {
                            const isUserAnimal = typeof animal === "string" && animal.startsWith("https://");
                            const imageUrl = isUserAnimal ? animal : animalsEnumImages[animal as AnimalEnum];

                            // optional: aktiven Namen holen, wenn du willst
                            const matchedAnimal = isUserAnimal
                                ? props.activeAnimals.find((a) => a.imageUrl === animal)
                                : null;

                            const name = isUserAnimal
                                ? matchedAnimal?.name || "Custom Animal"
                                : getAnimalEnumDisplayName(animal as AnimalEnum);

                            return (
                                <div key={number} className="deck-card">
                                    <img
                                        src={imageUrl}
                                        alt={name}
                                        className="deck-image"
                                        onClick={() => setPopupSavedDeckNumber(Number(number))}
                                    />
                                    <p>#{number}</p>
                                    <p>{name}</p>
                                </div>
                            );
                        })}
                    </div>


                    <div className="space-between">
                        <button
                            className="button-group-button"
                            onClick={() => saveUsersDeck(props.tempDeck)}
                        >
                            Save Temp Deck as User Deck
                        </button>
                        <button
                            id="button-profile"
                            onClick={() => saveUsersDeck(props.savedDeck)}
                        >
                            Save User Deck
                        </button>
                    </div>
                </>
            ) : (
                <h3 className="margin-top-50">
                    You can save your deck if you login with your GitHub account.
                </h3>
            )}

            {/* Popup für das Temp Deck */}
            {popupTempDeckNumber !== null && (
                <AnimalSelectPopup
                    deckNumber={popupTempDeckNumber}
                    deckType="temp"
                    closePopup={() => setPopupTempDeckNumber(null)}
                    setAnimalInDeck={(animal) => {
                        props.setTempDeck(prev => ({
                            ...prev,
                            [popupTempDeckNumber]: typeof animal === "string" || typeof animal === "object" ? animal : animal
                        }));
                        setPopupTempDeckNumber(null);
                    }}
                    activeAnimals={props.activeAnimals}
                />
            )}


            {/* Popup für das Saved Deck */}
            {popupSavedDeckNumber !== null && (
                <AnimalSelectPopup
                    deckNumber={popupSavedDeckNumber}
                    deckType="saved"
                    closePopup={() => setPopupSavedDeckNumber(null)}
                    setAnimalInDeck={(animal) => {
                        props.setSavedDeck(prev => ({
                            ...prev,
                            [popupSavedDeckNumber]: typeof animal === "string" || typeof animal === "object" ? animal : animal
                        }));
                        setPopupSavedDeckNumber(null);
                    }}
                    activeAnimals={props.activeAnimals}
                />
            )}

            {savedPopup && (
                <div className="saved-animation">
                    <p>Deck saved</p>
                </div>
            )}
        </div>
    );
}