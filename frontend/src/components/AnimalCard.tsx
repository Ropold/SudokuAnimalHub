import {AnimalModel} from "./model/AnimalModel.ts";
import {useNavigate} from "react-router-dom";

type AnimalCardProps = {
    animal: AnimalModel;
    user: string;
    favorites: string[];
    toggleFavorite: (animalId: string) => void;
}

export default function AnimalCard(props: Readonly<AnimalCardProps>) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/animal/${props.animal.id}`);
    }

    const isFavorite = props.favorites.includes(props.animal.id);

    return (
            <div className="animal-card" onClick={handleCardClick}>
                <h3>{props.animal.name}</h3>
                <img src={props.animal.imageUrl} alt={props.animal.name} className="animal-card-image" />

                {props.user !== "anonymousUser" && (
                    <button
                        id="button-favorite-animal-card"
                        onClick={(event) => {
                            event.stopPropagation(); // Verhindert die Weitergabe des Klicks an die Karte
                            props.toggleFavorite(props.animal.id);
                        }}
                        className={isFavorite ? "favorite-on" : "favorite-off"}
                    >
                        ♥
                    </button>
                )}
            </div>
    )
}