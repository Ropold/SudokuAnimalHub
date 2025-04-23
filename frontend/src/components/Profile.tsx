import { useState, useEffect } from "react";
import { UserDetails } from "./model/UserDetailsModel.ts";
import AddAnimalCard from "./AddAnimalCard.tsx";
import Favorites from "./Favorites.tsx";
import MyAnimals from "./MyAnimals.tsx";
import "./styles/Profile.css";
import { AnimalModel } from "./model/AnimalModel.ts";
import AddSudokuGrid from "./AddSudokuGrid.tsx";
import AllSudokuGrids from "./AllSudokuGrids.tsx";
import {SudokuGridModel} from "./model/SudokuGridModel.ts";

type ProfileProps = {
    user: string;
    userDetails: UserDetails | null;
    handleNewAnimalSubmit: (newAnimal: AnimalModel) => void;
    allAnimals: AnimalModel[];
    setAllAnimals: React.Dispatch<React.SetStateAction<AnimalModel[]>>;
    getAllAnimals: () => void;
    favorites: string[];
    toggleFavorite: (animalId: string) => void;
    allSudokuGrids: SudokuGridModel[];
    getAllSudokuGrids: () => void;
};

export default function Profile(props: Readonly<ProfileProps>) {
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const [activeTab, setActiveTab] = useState<"profile" | "add-animal" | "my-animals" | "favorites" | "add-sudoku-grid" | "all-sudoku-grids">(() => {
        const savedTab = localStorage.getItem("activeTab");
        return (savedTab as "profile" | "add-animal" | "my-animals" | "favorites" | "add-sudoku-grid" | "all-sudoku-grids") || "profile";
    });

    useEffect(() => {
        localStorage.setItem("activeTab", activeTab);
    }, [activeTab]);

    return (
        <div className="profile-container">
            {/* Button-Navigation */}
            <div className="space-between" id="buttons-profile-container">
                <button className={activeTab === "profile" ? "active-profile-button" : "button-group-button"} onClick={() => setActiveTab("profile")}>Profil of Github</button>
                <button className={activeTab === "add-animal" ? "active-profile-button" : "button-group-button"} onClick={() => setActiveTab("add-animal")}>Add new Animal</button>
                <button className={activeTab === "my-animals" ? "active-profile-button" : "button-group-button"} onClick={() => { setActiveTab("my-animals"); setIsEditing(false); }}>My Animals</button>
                <button className={activeTab === "favorites" ? "active-profile-button" : "button-group-button"} onClick={() => setActiveTab("favorites")}>Favorites of Animals</button>
                <button className={activeTab === "add-sudoku-grid" ? "active-profile-button" : "button-group-button"} onClick={() => setActiveTab("add-sudoku-grid")}>Add new Sudoku Grid</button>
                <button className={activeTab === "all-sudoku-grids" ? "active-profile-button" : "button-group-button"}  onClick={() => {setActiveTab("all-sudoku-grids");props.getAllSudokuGrids();}}>All Sudoku Grids</button>
            </div>

            {/* Anzeige je nach aktivem Tab */}
            <div>
                {activeTab === "profile" && (
                    <>
                        <h2>GitHub Profile</h2>
                        {props.userDetails ? (
                            <div>
                                <p>Username: {props.userDetails.login}</p>
                                <p>Name: {props.userDetails.name || "No name provided"}</p>
                                <p>Location: {props.userDetails.location ?? "No location provided"}</p>
                                {props.userDetails.bio && <p>Bio: {props.userDetails.bio}</p>}
                                <p>Followers: {props.userDetails.followers}</p>
                                <p>Following: {props.userDetails.following}</p>
                                <p>Public Repositories: {props.userDetails.public_repos}</p>
                                <p>
                                    GitHub Profile:{" "}
                                    <a href={props.userDetails.html_url} target="_blank" rel="noopener noreferrer">
                                        Visit Profile
                                    </a>
                                </p>
                                <img className="profile-container-img" src={props.userDetails.avatar_url} alt={`${props.userDetails.login}'s avatar`} />
                                <p>Account Created: {new Date(props.userDetails.created_at).toLocaleDateString()}</p>
                                <p>Last Updated: {new Date(props.userDetails.updated_at).toLocaleDateString()}</p>
                            </div>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </>
                )}
                {activeTab === "add-animal" && <AddAnimalCard user={props.user} handleNewAnimalSubmit={props.handleNewAnimalSubmit} />}
                {activeTab === "my-animals" && <MyAnimals allAnimals={props.allAnimals} getAllAnimals={props.getAllAnimals} setAllAnimals={props.setAllAnimals} user={props.user} favorites={props.favorites} toggleFavorite={props.toggleFavorite} isEditing={isEditing} setIsEditing={setIsEditing}/>}
                {activeTab === "favorites" && <Favorites user={props.user} favorites={props.favorites} toggleFavorite={props.toggleFavorite} />}
                {activeTab === "add-sudoku-grid" && <AddSudokuGrid user={props.user}/>}
                {activeTab === "all-sudoku-grids" && <AllSudokuGrids allSudokuGrids={props.allSudokuGrids}/>}

            </div>
        </div>
    );
}
