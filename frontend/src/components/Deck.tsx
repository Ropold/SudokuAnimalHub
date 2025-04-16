import axios from "axios";
import {NumberToAnimalMap} from "./model/NumberToAnimalMap.ts";
import {AnimalModel} from "./model/AnimalModel.ts";

type DeckProps = {
    activeAnimals: AnimalModel[];
    tempDeck: NumberToAnimalMap;
    savedDeck: NumberToAnimalMap;
    setSavedDeck: (deck: NumberToAnimalMap) => void;
}

export default function Deck(props: Readonly<DeckProps>) {

    function saveUsersDeck() {
        axios
            .post("/api/users/numbers-to-animal", props.tempDeck)
            .then(() => {
                props.setSavedDeck(props.tempDeck);
            })
            .catch((error) => {
                console.error("Error saving deck:", error);
            });
    }

    return(
        <div>
            <h3>Deck</h3>
        </div>
    )
}