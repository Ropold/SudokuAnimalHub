import {useEffect, useState} from "react";
import axios from "axios";
import {AnimalModel} from "./model/AnimalModel.ts";
import AnimalCard from "./AnimalCard.tsx";

type FavoritesProps = {
    user: string;
    favorites: string[];
    toggleFavorite: (animalId: string) => void;
}

export default function Favorites(props: Readonly<FavoritesProps>) {
    const [favoritesAnimals, setFavoritesAnimals] = useState<AnimalModel[]>([]);

    useEffect(() => {
        axios
            .get(`/api/users/favorites`)
            .then((response) => {
                setFavoritesAnimals(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [props.user, props.favorites]);

    return (
        <>
            <div className="animal-card-container">
                {favoritesAnimals.length > 0 ? (
                    favoritesAnimals.map((a) => (  // ← Korrekte Syntax mit `r`
                        <AnimalCard
                            key={a.id}
                            animal={a}
                            user={props.user}
                            favorites={props.favorites}
                            toggleFavorite={props.toggleFavorite}
                        />
                    ))
                ) : (
                    <p>No Animals in favorites</p>
                )}
            </div>
        </>
    );
}
