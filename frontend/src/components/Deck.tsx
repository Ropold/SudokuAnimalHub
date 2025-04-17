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
import {isAnimalOfUser} from "./utils/isAnimalOfUser.ts";

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
        const cleanedDeck: { [key: number]: string } = {};

        Object.entries(deck).forEach(([key, value]) => {
            cleanedDeck[Number(key)] = isAnimalOfUser(value)
                ? value.imageUrl
                : value;
        });

        axios
            .post("/api/users/numbers-to-animal", cleanedDeck)
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
                {Object.entries(props.tempDeck).map(([number, animal]) => (
                    <div key={number} className="deck-card">
                        <img
                            src={isAnimalOfUser(animal) ? animal.imageUrl : animalsEnumImages[animal]}
                            alt={isAnimalOfUser(animal) ? animal.name : getAnimalEnumDisplayName(animal)}
                            className="deck-image"
                            onClick={() => setPopupTempDeckNumber(Number(number))}
                        />
                        <p>#{number}</p>
                        <p>{isAnimalOfUser(animal) ? animal.name : getAnimalEnumDisplayName(animal)}</p>
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
                                    src={isAnimalOfUser(animal) ? animal.imageUrl : animalsEnumImages[animal]}
                                    alt={isAnimalOfUser(animal) ? animal.name : getAnimalEnumDisplayName(animal)}
                                    className="deck-image"
                                    onClick={() => setPopupSavedDeckNumber(Number(number))}
                                />
                                <p>#{number}</p>
                                <p>{isAnimalOfUser(animal) ? animal.name : getAnimalEnumDisplayName(animal)}</p>
                            </div>
                        ))}
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
                    setAnimalInDeck={(animalEnum) => {
                        props.setTempDeck(prev => ({
                            ...prev,
                            [popupTempDeckNumber]: animalEnum as AnimalEnum
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
                    setAnimalInDeck={(animalEnum) => {
                        props.setSavedDeck(prev => ({
                            ...prev,
                            [popupSavedDeckNumber]: animalEnum as AnimalEnum
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