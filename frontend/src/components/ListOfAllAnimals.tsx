import {AnimalModel} from "./model/AnimalModel.ts";

type ListOfAllAnimalsProps = {
    activeAnimals: AnimalModel[];
}

export default function ListOfAllAnimals(props: Readonly<ListOfAllAnimalsProps>) {
    return (

            <h3>List of all Animals</h3>
    )
}