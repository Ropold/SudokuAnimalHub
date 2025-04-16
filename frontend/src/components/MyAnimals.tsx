import {AnimalModel} from "./model/AnimalModel.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import * as React from "react";
import AnimalCard from "./AnimalCard.tsx";

type MyAnimalsProps = {
    allAnimals: AnimalModel[];
    getAllAnimals: () => void;
    setAllAnimals: React.Dispatch<React.SetStateAction<AnimalModel[]>>
    user: string;
    favorites: string[];
    toggleFavorite: (animalId: string) => void;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MyAnimals(props: Readonly<MyAnimalsProps>) {

    const [editData, setEditData] = useState<AnimalModel | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [animalToDelete, setAnimalToDelete] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [imageChanged, setImageChanged] = useState(false);

    function handleEditToggle (animalId: string) {
        const animalToEdit = props.allAnimals.find((animal) => animal.id === animalId);
        if (animalToEdit) {
            setEditData(animalToEdit);
            props.setIsEditing(true);

            // Hier nehmen wir einfach an, dass immer ein Bild vorhanden ist, wenn imageUrl gesetzt ist
            fetch(animalToEdit.imageUrl)
                .then((response) => response.blob())
                .then((blob) => {
                    const file = new File([blob], "current-image.jpg", { type: blob.type });
                    setImage(file);
                })
                .catch((error) => console.error("Error loading current image:", error));
        }
    };

    function handleToggleActiveStatu(animalId: string) {
        axios
            .put(`/api/users/${animalId}/toggle-active`)
            .then(() => {
                props.setAllAnimals((prevAnimals) =>
                    prevAnimals.map((a) =>
                        a.id === animalId ? { ...a, isActive: !a.isActive } : a
                    )
                );
            })
            .catch((error) => {
                console.error("Error during Toggle Offline/Active", error);
                alert("An Error while changing the status of Active/Offline.");
            });
    };

    function handleSaveEdit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!editData) {
            return;
        }

        const updatedAnimalData = {
            ...editData,
            imageUrl: image ? "temp-image" : editData.imageUrl, // Nur ersetzen, wenn ein neues Bild hochgeladen wurde
        };

        const data = new FormData();
        if (imageChanged && image) {
            data.append("image", image);
        }

        data.append("animalModelDto", new Blob([JSON.stringify(updatedAnimalData)], {type: "application/json"}));

        axios
            .put(`/api/sudoku-animal-hub/${editData.id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                props.setAllAnimals((prevAnimals) =>
                    prevAnimals.map((animal) =>
                        animal.id === editData.id ? {...animal, ...response.data} : animal
                    )
                );
                props.setIsEditing(false);
            })
            .catch((error) => {
                console.error("Error saving animal edits:", error);
                alert("An unexpected error occurred. Please try again.");
            });
    };

    function onFileChange (e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setImage(e.target.files[0]);
            setImageChanged(true);
        }
    };

    function handleDeleteClick(id: string) {
        setAnimalToDelete(id);
        setShowPopup(true);
    }

    function handleCancel(){
        setAnimalToDelete(null);
        setShowPopup(false);
    }

    function handleConfirmDelete() {
        if (animalToDelete) {
            axios
                .delete(`/api/sudoku-animal-hub/${animalToDelete}`)
                .then(() => {
                    props.setAllAnimals((prevAnimals) =>
                        prevAnimals.filter((animal) => animal.id !== animalToDelete)
                    );
                })
                .catch((error) => {
                    console.error("Error deleting animal:", error);
                    alert("An unexpected error occurred. Please try again.");
                });
        }
        setAnimalToDelete(null);
        setShowPopup(false);
    }

    useEffect(() => {
        props.getAllAnimals()
    }, []);

    return (
        <div>
            {props.isEditing ? (
                <div className="edit-form">
                    <h2>Edit Animal</h2>
                    <form onSubmit={handleSaveEdit}>
                        <label>
                            Name:
                            <input
                                className="input-small"
                                type="text"
                                value={editData?.name || ""}
                                onChange={(e) => setEditData({ ...editData!, name: e.target.value })}
                            />
                        </label>

                        <label>
                            Description:
                            <textarea
                                className="textarea-large"
                                value={editData?.description || ""}
                                onChange={(e) => setEditData({ ...editData!, description: e.target.value })}
                            />
                        </label>

                        <label>
                            Visibility:
                            <select
                                className="input-small"
                                value={editData?.isActive ? "true" : "false"}
                                onChange={(e) => setEditData({ ...editData!, isActive: e.target.value === "true" })}
                            >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </label>

                        <label>
                            Image:
                            <input type="file" onChange={onFileChange} />
                            {image && (
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt={editData?.name || "Preview"}
                                    style={{ width: "150px", marginTop: "10px" }}
                                />
                            )}
                        </label>

                        <div className="space-between">
                            <button className="button-group-button" type="submit">Save Changes</button>
                            <button className="button-group-button" type="button" onClick={() => props.setIsEditing(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="animal-card-container">
                    {props.allAnimals.length > 0 ? (
                        props.allAnimals.map((a) => (
                            <div key={a.id}>
                                <AnimalCard
                                    animal={a}
                                    user={props.user}
                                    favorites={props.favorites}
                                    toggleFavorite={props.toggleFavorite}
                                />
                                <div className="space-between">
                                    <button
                                        id={a.isActive ? "active-button-my-animals" : "button-is-inactive"}
                                        onClick={() => handleToggleActiveStatu(a.id)}
                                    >
                                        {a.isActive ? "Active" : "Inactive"}
                                    </button>
                                    <button className="button-group-button" onClick={() => handleEditToggle(a.id)}>
                                        Edit
                                    </button>
                                    <button id="button-delete" onClick={() => handleDeleteClick(a.id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No animals found for this user.</p>
                    )}
                </div>
            )}

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this animal?</p>
                        <div className="popup-actions">
                            <button onClick={handleConfirmDelete} className="popup-confirm">Yes, Delete</button>
                            <button onClick={handleCancel} className="popup-cancel">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}