import {AnimalModel} from "./model/AnimalModel.ts";
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

type ListOfAllAnimalsProps = {
    activeAnimals: AnimalModel[];
    getActiveAnimals: () => void;
    favorites: string[];
    toggleFavorite: (animalId: string) => void;
    currentPage: number;
    setCurrentPage: (pageNumber: number) => void;
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
        const indexOfFirstReveal = indexOfLastAnimal - animalsPerPage;
        const currentAnimals = filteredAnimals.slice(indexOfFirstReveal, indexOfLastAnimal);
        const totalPages = Math.ceil(filteredAnimals.length / animalsPerPage);
        return { currentReveals: currentAnimals, totalPages };
    }

    const { currentReveals, totalPages } = getPaginationData();

    return (

            <h3>List of all Animals</h3>
    )
}