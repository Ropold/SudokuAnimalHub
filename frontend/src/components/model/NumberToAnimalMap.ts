import {AnimalEnum} from "./AnimalEnum.ts";

export type NumberToAnimalMap = {
    [key: number]: AnimalEnum | AnimalOfUser;
};

export type AnimalOfUser = {
    name: string;
    imageUrl: string;
}

export const DefaultNumberToAnimalMap: NumberToAnimalMap = {
    1: "CAT",
    2: "DOG",
    3: "BEAR",
    4: "FOX",
    5: "ELEPHANT",
    6: "MONKEY",
    7: "LION",
    8: "PENGUIN",
    9: "RABBIT"
};