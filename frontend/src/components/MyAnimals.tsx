import {AnimalModel} from "./model/AnimalModel.ts";

type MyAnimalsProps = {
    allAnimals: AnimalModel[];
}

export default function MyAnimals(props: Readonly<MyAnimalsProps>) {
    return (
        <h3>My Animals</h3>
    )
}