import {AnimalModel} from "./model/AnimalModel.ts";

type AddAnimalCardProps = {
    user: string
    handleNewAnimalSubmit: (newAnimal: AnimalModel) => void
}

export default function AddAnimalCard(props: Readonly<AddAnimalCardProps>) {
    return(
        <>
        <h3>Add Animal Card</h3>
        <p>{props.user}</p>
        </>
    )
}