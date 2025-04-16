import {AnimalModel} from "./model/AnimalModel.ts";
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import SearchBar from "./SearchBar.tsx";
import AnimalCard from "./AnimalCard.tsx";
import "./styles/AnimalCard.css"

type ListOfAllAnimalsProps = {
    activeAnimals: AnimalModel[];
    getActiveAnimals: () => void;
    favorites: string[];
    toggleFavorite: (animalId: string) => void;
    currentPage: number;
    setCurrentPage: (pageNumber: number) => void;
    user: string;
}

export default function ListOfAllAnimals(props: Readonly<ListOfAllAnimalsProps>) {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredAnimals, setFilteredAnimals] = useState<AnimalModel[]>([]);
    const [selectedAnimalEnum, setSelectedAnimalEnum] = useState<AnimalModel["animalEnum"] | "">("");
    const [animalsPerPage, setAnimalsPerPage] = useState<number>(9);

    const location = useLocation();


    useEffect(() => {
        props.getActiveAnimals();
    }, []);

    useEffect(() => {
        window.scroll(0, 0);
    }, [location]);

    useEffect(() => {
        const updateAnimalsPerPage = () => {
            if (window.innerWidth < 768) {
                setAnimalsPerPage(8);
            } else if (window.innerWidth < 1200) {
                setAnimalsPerPage(9);
            } else {
                setAnimalsPerPage(12);
            }
        };
        updateAnimalsPerPage();
        window.addEventListener("resize", updateAnimalsPerPage);

        return () => {
            window.removeEventListener("resize", updateAnimalsPerPage);
        };
    }, []);

    function filterAnimals(animals: AnimalModel[], query: string, animalEnum: string) {
        return animals.filter((animal) => {
            const matchesAnimalEnum = animalEnum ? animal.animalEnum === animalEnum : true;
            const matchesSearch =
                animal.name.toLowerCase().includes(query.toLowerCase()) ||
                animal.description.toLowerCase().includes(query.toLowerCase());
            return matchesAnimalEnum && matchesSearch;
        });
    }

    useEffect(() => {
        setFilteredAnimals(filterAnimals(props.activeAnimals, searchQuery, selectedAnimalEnum));
    }, [props.activeAnimals, searchQuery, selectedAnimalEnum]);

    function getPaginationData() {
        const indexOfLastAnimal = props.currentPage * animalsPerPage;
        const indexOfFirstAnimal = indexOfLastAnimal - animalsPerPage;
        const currentAnimals = filteredAnimals.slice(indexOfFirstAnimal, indexOfLastAnimal);
        const totalPages = Math.ceil(filteredAnimals.length / animalsPerPage);
        return { currentAnimals: currentAnimals, totalPages };
    }

    const { currentAnimals, totalPages } = getPaginationData();

    return (
            <>
            <h2>List of all Animals</h2>
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedAnimalEnum={selectedAnimalEnum}
                    setSelectedAnimalEnum={setSelectedAnimalEnum}
                    activeAnimals={props.activeAnimals}
                />
                <div className="animal-card-container">
                    {currentAnimals.map((a) => (
                        <AnimalCard
                            key={a.id}
                            animal={a}
                            user={props.user}
                            favorites={props.favorites}
                            toggleFavorite={props.toggleFavorite}
                        />
                    ))}
                </div>
                <div className="space-between">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            className={"button-group-button"}
                            id={index +1 === props.currentPage ? "active-paginate" : undefined}
                            onClick={() => {
                                props.setCurrentPage(index + 1);
                            }}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </>
    )
}