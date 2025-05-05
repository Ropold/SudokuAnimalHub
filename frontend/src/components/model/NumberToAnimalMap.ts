import {AnimalEnum} from "./AnimalEnum.ts";

export type NumberToAnimalMap = {
    [key: number]: AnimalEnum | string;
};

export type AnimalOfUser = {
    name: string;
    imageUrl: string;
}

export const DefaultNumberToAnimalMap: NumberToAnimalMap = {
    1: "CAT",
    2: "WHALE",
    3: "CHICKEN",
    4: "FISH",
    5: "FROG",
    6: "LLAMA",
    7: "ZEBRA",
    8: "PENGUIN",
    9: "TURTLE"
};