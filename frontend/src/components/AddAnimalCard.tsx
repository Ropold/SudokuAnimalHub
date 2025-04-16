import {AnimalModel} from "./model/AnimalModel.ts";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {All_ANIMALS_ENUM, AnimalEnum} from "./model/AnimalEnum.ts";
import {getAnimalEnumDisplayName} from "./utils/getAnimalEnumDisplayName.ts";
import "./styles/AddAnimalCard.css"
import "./styles/Popup.css"
import { animalsEnumImages } from "./utils/AnimalEnumImages.ts"

type AddAnimalCardProps = {
    user: string
    handleNewAnimalSubmit: (newAnimal: AnimalModel) => void
}

export default function AddAnimalCard(props: Readonly<AddAnimalCardProps>) {

    const [name, setName] = useState<string>("");
    const [animalEnum, setAnimalEnum] = useState<string | null>(null);
    const [description, setDescription] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");

    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [showPopup, setShowPopup] = useState(false);

    const navigate = useNavigate();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const animalData = {
            name,
            animalEnum,
            description,
            isActive: true,
            githubId: props.user,
            imageUrl: imageUrl,
        };

        const data = new FormData();

        if (image) {
            data.append("image", image);
        }

        data.append("animalModelDto", new Blob([JSON.stringify(animalData)], { type: "application/json" }));

        axios
            .post("api/sudoku-animal-hub", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                console.log("Animal saved:", response.data);
                navigate(`/animal/${response.data.id}`);
            })
            .catch((error) => {
                if (error.response && error.response.status === 400 && error.response.data) {
                    const errorMessages = error.response.data;
                    const errors: string[] = [];
                    Object.keys(errorMessages).forEach((field) => {
                        errors.push(`${field}: ${errorMessages[field]}`);
                    });

                    setErrorMessages(errors);
                    setShowPopup(true);
                } else {
                    alert("An unexpected error occurred. Please try again.");
                }
            });
    }

    function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if(e.target.files){
            const file = e.target.files[0];
            setImage(file);
            setImageUrl("temp-image")
        }
    }

    function handleClosePopup() {
        setShowPopup(false);
        setErrorMessages([]);
    }

    return(

            <div className="edit-form">
                <h2>Add new Animal Card</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input
                            className="input-small"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>

                    <div className="animal-category-row">
                        <label className="animal-category-label">
                            Animal Category:
                            <select
                                className="input-small select-space"
                                value={animalEnum || ""}
                                onChange={(e) => setAnimalEnum(e.target.value)}
                            >
                                <option value="">Select Animal Category</option>
                                {All_ANIMALS_ENUM.map((animal) => (
                                    <option key={animal} value={animal}>
                                        {getAnimalEnumDisplayName(animal)}
                                    </option>
                                ))}
                            </select>
                        </label>

                        {animalEnum && animalsEnumImages[animalEnum as AnimalEnum] && (
                            <img
                                src={animalsEnumImages[animalEnum as AnimalEnum]}
                                alt={animalEnum}
                                className="animal-card-image-add"
                            />
                        )}
                    </div>

                    <label>
                        Description:
                        <textarea
                            className="textarea-large"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </label>

                    <label>
                        Image:
                        <input
                            type="file"
                            onChange={onFileChange}
                        />
                    </label>

                    {image && (
                        <img src={URL.createObjectURL(image)} className="animal-card-image" alt="Preview" />
                    )}

                    <div className="space-between">
                        <button className="button-group-button" type="submit">Add Animal Card</button>
                    </div>
                </form>

                {showPopup && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <h3>Validation Errors</h3>
                            <ul>
                                {errorMessages.map((msg, index) => (
                                    <li key={index}>{msg}</li>
                                ))}
                            </ul>
                            <div className="popup-actions">
                                <button className="popup-cancel" onClick={handleClosePopup}>Close</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
    )
}