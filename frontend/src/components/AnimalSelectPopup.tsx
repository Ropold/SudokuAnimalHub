import { useState } from "react";
import { animalsEnumImages } from "./utils/AnimalEnumImages";
import { getAnimalEnumDisplayName } from "./utils/getAnimalEnumDisplayName";
import { All_ANIMALS_ENUM, AnimalEnum } from "./model/AnimalEnum.ts";
import { AnimalModel } from "./model/AnimalModel.ts";
import "./styles/AnimalSelectPopup.css";
import { AnimalOfUser } from "./model/NumberToAnimalMap.ts";
import { isAnimalOfUser } from "./utils/isAnimalOfUser.ts";

type AnimalSelectPopupProps = {
    deckNumber: number;
    deckType: "temp" | "saved";
    closePopup: () => void;
    setAnimalInDeck: (animal: AnimalEnum | string) => void;
    activeAnimals: AnimalModel[];
};

export default function AnimalSelectPopup(props: Readonly<AnimalSelectPopupProps>) {
    const [selectedAnimalEnum, setSelectedAnimalEnum] = useState<string | null>(null);

    const handleAnimalSelect = (animal: AnimalEnum | AnimalOfUser) => {
        const valueToStore = isAnimalOfUser(animal) ? animal.imageUrl : animal;

        props.setAnimalInDeck(valueToStore);
        setSelectedAnimalEnum(isAnimalOfUser(animal) ? animal.name : animal); // nur UI
        props.closePopup();
    };


    // Combine active user animals with the default animals from enum
    const allAnimals: (AnimalEnum | AnimalOfUser)[] = [
        ...props.activeAnimals.map((animal) => ({
            name: animal.name,
            imageUrl: animal.imageUrl,
        })),
        ...All_ANIMALS_ENUM,
    ];

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="button-group-button" onClick={props.closePopup}>
                    Close
                </button>
                <h3>Select an Animal for #{props.deckNumber}</h3>
                <div className="popup-animal-grid">
                    {allAnimals.map((animal, index) => {
                        const imageUrl = isAnimalOfUser(animal)
                            ? animal.imageUrl // If it's a user animal, use the imageUrl
                            : animalsEnumImages[animal]; // Else, use the default image from the enum
                        const name = isAnimalOfUser(animal)
                            ? animal.name // If it's a user animal, use the name of the user animal
                            : getAnimalEnumDisplayName(animal); // Else, use the enum name

                        return (
                            <div
                                key={`animal-${index}`}
                                className={`deck-animal-card ${
                                    selectedAnimalEnum === name ? "selected" : ""
                                }`}
                                onClick={() => handleAnimalSelect(animal)}
                            >
                                <img
                                    src={imageUrl}
                                    alt={name}
                                    className="popup-animal-image"
                                />
                                <p>{name}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
