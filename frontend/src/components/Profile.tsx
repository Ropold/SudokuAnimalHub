import { useState, useEffect } from "react";
import { UserDetails } from "./model/UserDetailsModel.ts";
import AddAnimalCard from "./AddAnimalCard.tsx";
import Favorites from "./Favorites.tsx";
import MyAnimals from "./MyAnimals.tsx";
import "./styles/Profile.css";
import { AnimalModel } from "./model/AnimalModel.ts";

type ProfileProps = {
    user: string;
    userDetails: UserDetails | null;
    handleNewAnimalSubmit: (newAnimal: AnimalModel) => void;
    allAnimals: AnimalModel[];
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
    favorites: string[];
    toggleFavorite: (animalId: string) => void;
};

export default function Profile(props: Readonly<ProfileProps>) {
    const [activeTab, setActiveTab] = useState<"profile" | "add" | "my-animals" | "favorites">(() => {
        const savedTab = localStorage.getItem("activeTab");
        return (savedTab as "profile" | "add" | "my-animals" | "favorites") || "profile";
    });

    useEffect(() => {
        localStorage.setItem("activeTab", activeTab);
    }, [activeTab]);

    return (
        <div className="profile-container">
            {/* Button-Navigation */}
            <div className="space-between">
                <button className={activeTab === "profile" ? "active-profile-button" : "button-group-button"} onClick={() => setActiveTab("profile")}>Profil</button>
                <button className={activeTab === "add" ? "active-profile-button" : "button-group-button"} onClick={() => setActiveTab("add")}>Add new Animal</button>
                <button className={activeTab === "my-animals" ? "active-profile-button" : "button-group-button"} onClick={() => setActiveTab("my-animals")}>My Animals</button>
                <button className={activeTab === "favorites" ? "active-profile-button" : "button-group-button"} onClick={() => setActiveTab("favorites")}>Favorites</button>
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
                {activeTab === "add" && <AddAnimalCard user={props.user} handleNewAnimalSubmit={props.handleNewAnimalSubmit} />}
                {activeTab === "my-animals" && <MyAnimals allAnimals={props.allAnimals} />}
                {activeTab === "favorites" && <Favorites user={props.user} favorites={props.favorites} toggleFavorite={props.toggleFavorite} />}
            </div>
        </div>
    );
}
