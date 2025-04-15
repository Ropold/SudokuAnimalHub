import { UserDetails } from "./model/UserDetailsModel.ts";
import AddAnimalCard from "./AddAnimalCard.tsx";
import Favorites from "./Favorites.tsx";
import MyAnimals from "./MyAnimals.tsx";
import "./styles/Profile.css";
import {AnimalModel} from "./model/AnimalModel.ts";

type ProfileProps = {
    user: string;
    userDetails: UserDetails | null;
    handleNewAnimalSubmit:(newAnimal:AnimalModel)=> void;
    activeTab: "profile" | "add" | "my-animals" | "favorites";
    setActiveTab: (tab: "profile" | "add" | "my-animals" | "favorites") => void;
    allAnimals: AnimalModel[];
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
};

export default function Profile(props: Readonly<ProfileProps>) {

    return (
        <div className="profile-container">
            {/* Button-Navigation */}
            <div className="space-between">
                <button className={props.activeTab === "profile" ? "active-profile-button" : "button-group-button"} onClick={() => props.setActiveTab("profile")}>Profil</button>
                <button className={props.activeTab === "add" ? "active-profile-button" : "button-group-button"} onClick={() => props.setActiveTab("add")}>Add new Animal</button>
                <button className={props.activeTab === "my-animals" ? "active-profile-button" : "button-group-button"} onClick={() => props.setActiveTab("my-animals")}>My Animals</button>
                <button className={props.activeTab === "favorites" ? "active-profile-button" : "button-group-button"} onClick={() => props.setActiveTab("favorites")}>Favorites</button>
            </div>

            {/* Anzeige je nach aktivem Tab */}
            <div>
                {props.activeTab === "profile" && (
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
                {props.activeTab === "add" && <AddAnimalCard user={props.user} handleNewAnimalSubmit={props.handleNewAnimalSubmit}/>}
                {props.activeTab === "my-animals" && <MyAnimals allAnimals={props.allAnimals} />}
                {props.activeTab === "favorites" && <Favorites />}
            </div>
        </div>
    );
}
