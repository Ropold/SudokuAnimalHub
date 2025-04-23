import {AnimalEnum} from "./AnimalEnum.ts";

export type AnimalModel = {
    id: string;
    name: string;
    animalEnum: AnimalEnum
    description: string;
    isActive: boolean;
    githubId: string;
    imageUrl: string;
}

export const DefaultAnimal: AnimalModel = {
    id: "",
    name: "Loading....",
    animalEnum: "CAT",
    description: "",
    isActive: true,
    githubId: "",
    imageUrl: "https://dummyimage.com/300x200/cccccc/000000&text=No+Image+Available",
};