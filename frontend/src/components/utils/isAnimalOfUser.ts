import {AnimalOfUser} from "../model/NumberToAnimalMap.ts";
import {AnimalEnum} from "../model/AnimalEnum.ts";


export function isAnimalOfUser(
    value: AnimalEnum | AnimalOfUser
): value is AnimalOfUser {
    return typeof value === "object" && "imageUrl" in value && "name" in value;
}