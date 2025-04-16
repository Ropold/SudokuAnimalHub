import { AnimalModel } from "./model/AnimalModel.ts";
import { AnimalEnum } from "./model/AnimalEnum.ts";

type SearchBarProps = {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    selectedAnimalEnum: AnimalEnum | "";
    setSelectedAnimalEnum: (value: AnimalEnum | "") => void;
    activeAnimals: AnimalModel[];
};

export default function SearchBar(props: Readonly<SearchBarProps>) {
    const {
        searchQuery,
        setSearchQuery,
        selectedAnimalEnum,
        setSelectedAnimalEnum,
        activeAnimals
    } = props;

    const animalTypes = Array.from(new Set(activeAnimals.map((animal) => animal.animalEnum))).sort();

    const handleReset = () => {
        setSearchQuery("");
        setSelectedAnimalEnum("");
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
            />
            <label>
                <select
                    value={selectedAnimalEnum}
                    onChange={(e) => setSelectedAnimalEnum(e.target.value as AnimalEnum | "")}
                >
                    <option value="">Filter by Animal Type</option>
                    {animalTypes.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </label>
            <button
                onClick={handleReset}
                className={`${searchQuery || selectedAnimalEnum ? "button-group-button" : "button-grey"}`}
            >
                Reset Filters
            </button>
        </div>
    );
}