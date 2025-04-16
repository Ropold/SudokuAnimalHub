import {AnimalModel} from "./model/AnimalModel.ts";

type MyAnimalsProps = {
    allAnimals: AnimalModel[];
    getAllAnimals: () => void;
    setAllAnimals: (animals: AnimalModel[]) => void;
    user: string;
    favorites: string[];
    toggleFavorite: (animalId: string) => void;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
}

export default function MyAnimals(props: Readonly<MyAnimalsProps>) {



    return (
        <h3>My Animals</h3>
    )
}