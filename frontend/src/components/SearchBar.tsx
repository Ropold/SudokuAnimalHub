import {AnimalModel} from "./model/AnimalModel.ts";
import {AnimalEnum} from "./model/AnimalEnum.ts";

type SearchBarProps = {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    selectedAnimalEnum: AnimalEnum | "";
    setSelectedAnimalEnum: (value: AnimalEnum | "") => void;
    activeAnimals: AnimalModel[];
}

export default function SearchBar(props: Readonly<SearchBarProps>) {
    return(
        <h3>Searchbar</h3>
    )
}