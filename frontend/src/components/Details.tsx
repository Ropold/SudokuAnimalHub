import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AnimalModel, DefaultAnimal } from "./model/AnimalModel.ts";
import { DefaultUserDetails, UserDetails } from "./model/UserDetailsModel.ts";
import "./styles/Profile.css"

type DetailsProps = {
    user: string;
    favorites: string[];
    toggleFavorite: (animalId: string) => void;
}

export default function Details(props: Readonly<DetailsProps>) {
    const [animal, setAnimal] = useState<AnimalModel>(DefaultAnimal);
    const [githubUser, setGithubUser] = useState<UserDetails>(DefaultUserDetails);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (!id) return;
        axios
            .get(`/api/sudoku-animal-hub/${id}`)
            .then((response) => setAnimal(response.data))
            .catch((error) => console.error("Error fetching animal details", error));
    }, [id]);

    const fetchGithubUsername = async () => {
        try {
            const response = await axios.get(`https://api.github.com/user/${animal.githubId}`);
            setGithubUser(response.data);
        } catch (error) {
            console.error('Fehler beim Abrufen des GitHub-Nutzers:', error);
        }
    };

    useEffect(() => {
        if (animal.githubId) {
            fetchGithubUsername();
        }
    }, [animal.githubId]);

    const isFavorite = props.favorites.includes(animal.id);

    return (
        <>
            <div>
                <h2>{animal.name}</h2>
                <p><strong>Name:</strong> {animal.name}</p>
                <p><strong>Category:</strong> {animal.animalEnum}</p>
                <p><strong>Description:</strong> {animal.description || "No description available"}</p>
                <img src={animal.imageUrl} alt={animal.name} style={{ maxWidth: "300px" }} />
                {props.user !== "anonymousUser" && (
                    <div>
                        <button
                            className={`button-group-button ${isFavorite ? "favorite-on" : "favorite-off"}`}
                            onClick={() => props.toggleFavorite(animal.id)}
                        >
                            ♥
                        </button>
                    </div>

                )}
            </div>
            <div>
                <h3>Added by User</h3>
                <p><strong>Github-User</strong> {githubUser.login} </p>
                <p><strong>GitHub Profile</strong> <a href={githubUser.html_url} target="_blank" rel="noopener noreferrer">Visit Profile</a></p>
                <img className="profile-container-img" src={githubUser.avatar_url} alt={`${githubUser.login}'s avatar`} />
            </div>
        </>
    );
}
