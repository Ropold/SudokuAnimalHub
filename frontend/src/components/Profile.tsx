import { useState } from "react";
import { UserDetails } from "./model/UserDetailsModel.ts";
import AddAnimalCard from "./AddAnimalCard.tsx";
import Favorites from "./Favorites.tsx";
import MyAnimals from "./MyAnimals.tsx";
import "./styles/Profile.css";

type ProfileProps = {
    userDetails: UserDetails | null;
};

export default function Profile({ userDetails }: Readonly<ProfileProps>) {
    const [activeTab, setActiveTab] = useState<"profile" | "add" | "my-animals" | "favorites">("profile");

    return (
        <div className="profile-container">
            {/* Button-Navigation */}
            <div className="space-between">
                <button className={activeTab === "profile" ? "active-profile-button" : "button-group-button"} onClick={() => setActiveTab("profile")}>Profil</button>
                <button className={activeTab === "add" ? "active-profile-button" : "button-group-button"} onClick={() => setActiveTab("add")}>Add</button>
                <button className={activeTab === "my-animals" ? "active-profile-button" : "button-group-button"} onClick={() => setActiveTab("my-animals")}>My Animals</button>
                <button className={activeTab === "favorites" ? "active-profile-button" : "button-group-button"} onClick={() => setActiveTab("favorites")}>Favorites</button>
            </div>

            {/* Anzeige je nach aktivem Tab */}
            <div>
                {activeTab === "profile" && (
                    <>
                        <h2>GitHub Profile</h2>
                        {userDetails ? (
                            <div>
                                <p>Username: {userDetails.login}</p>
                                <p>Name: {userDetails.name || "No name provided"}</p>
                                <p>Location: {userDetails.location ?? "No location provided"}</p>
                                {userDetails.bio && <p>Bio: {userDetails.bio}</p>}
                                <p>Followers: {userDetails.followers}</p>
                                <p>Following: {userDetails.following}</p>
                                <p>Public Repositories: {userDetails.public_repos}</p>
                                <p>
                                    GitHub Profile:{" "}
                                    <a href={userDetails.html_url} target="_blank" rel="noopener noreferrer">
                                        Visit Profile
                                    </a>
                                </p>
                                <img src={userDetails.avatar_url} alt={`${userDetails.login}'s avatar`} />
                                <p>Account Created: {new Date(userDetails.created_at).toLocaleDateString()}</p>
                                <p>Last Updated: {new Date(userDetails.updated_at).toLocaleDateString()}</p>
                            </div>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </>
                )}
                {activeTab === "add" && <AddAnimalCard />}
                {activeTab === "my-animals" && <MyAnimals />}
                {activeTab === "favorites" && <Favorites />}
            </div>
        </div>
    );
}
