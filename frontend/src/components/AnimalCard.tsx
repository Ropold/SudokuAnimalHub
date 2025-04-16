import {AnimalModel} from "./model/AnimalModel.ts";
import {useNavigate} from "react-router-dom";

type AnimalCardProps = {
    animal: AnimalModel;
    user: string;
    favorites: string[];
    toggleFavorite: (animalId: string) => void;
    showButtons?: boolean;
    handleEditToggle?: (id: string) => void;
    handleDeleteClick?: (id: string) => void;
    handleToggleActiveStatus?: (id: string) => void;
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

                {props.showButtons && (
                    <div className="space-between">
                        <button
                            id={props.animal.isActive ? "active-button-my-animals" : "button-is-inactive"}
                            onClick={(e) => {
                                e.stopPropagation();
                                props.handleToggleActiveStatus?.(props.animal.id);
                            }}
                        >
                            {props.animal.isActive ? "Active" : "Inactive"}
                        </button>
                        <button
                            className="button-group-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                props.handleEditToggle?.(props.animal.id);
                            }}
                        >
                            Edit
                        </button>
                        <button
                            id="button-delete"
                            onClick={(e) => {
                                e.stopPropagation();
                                props.handleDeleteClick?.(props.animal.id);
                            }}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
    )
}