import {NumberToAnimalMap} from "./model/NumberToAnimalMap.ts";

type PlayProps = {
    user: string;
    tempDeck: NumberToAnimalMap;
    savedDeck: NumberToAnimalMap;
}

export default function Play(props: Readonly<PlayProps>) {
    return(
        <>
        <h3>Play</h3>
        <p>{props.user}</p>
        </>
    )
}