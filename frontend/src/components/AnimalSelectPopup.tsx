import { useState } from "react";
import { animalsEnumImages } from "./utils/AnimalEnumImages";
import { getAnimalEnumDisplayName } from "./utils/getAnimalEnumDisplayName";
import { All_ANIMALS_ENUM } from "./model/AnimalEnum.ts";
import {AnimalModel} from "./model/AnimalModel.ts";
import "./styles/AnimalSelectPopup.css"

type AnimalSelectPopupProps = {
    deckNumber: number;
    deckType: "temp" | "saved";
    closePopup: () => void;
    setAnimalInDeck: (animalEnum: string) => void;
    activeAnimals: AnimalModel[];
};

export default function AnimalSelectPopup(props: Readonly<AnimalSelectPopupProps>) {
    const [selectedAnimalEnum, setSelectedAnimalEnum] = useState<string | null>(null);

    const handleAnimalSelect = (animalEnum: string) => {
        setSelectedAnimalEnum(animalEnum);
        props.setAnimalInDeck(animalEnum);
    }; //falsch!!!!



    const allAnimals = [
        ...props.activeAnimals.map((animal) => ({
            animalEnum: animal.animalEnum,
            name: animal.name,
            imageUrl: animal.imageUrl,
        })),
        ...All_ANIMALS_ENUM.map((animalEnum) => ({
            animalEnum: animalEnum,
            name: getAnimalEnumDisplayName(animalEnum),
            imageUrl: animalsEnumImages[animalEnum],
        })),
    ];

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="button-group-button" onClick={props.closePopup}>Close</button>
                <h3>Select an Animal for #{props.deckNumber}</h3>
                <div className="popup-animal-grid">
                    {allAnimals.map((animal, index) => (
                        <div
                            key={`${animal.animalEnum}-${index}`}
                            className={`deck-animal-card ${selectedAnimalEnum === animal.animalEnum ? "selected" : ""}`}
                            onClick={() => handleAnimalSelect(animal.animalEnum)}
                        >
                            <img
                                src={animal.imageUrl}
                                alt={animal.name}
                                className="popup-animal-image"
                            />
                            <p>{animal.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

}
