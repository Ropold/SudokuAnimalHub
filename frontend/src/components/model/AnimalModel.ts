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
    imageUrl: "",
};