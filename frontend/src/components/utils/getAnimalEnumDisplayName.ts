import {AnimalEnum} from "../model/AnimalEnum.ts";

export function getAnimalEnumDisplayName(animalEnum: AnimalEnum): string {
    const animalEnumDisplayNames: Record<AnimalEnum, string> = {
        ANTEATER: "Anteater",
        ARMADILLO: "Armadillo",
        BEAR: "Bear",
        BEAVER: "Beaver",
        BIRD: "Bird",
        CAT: "Cat",
        CHAMELEON: "Chameleon",
        CHICKEN: "Chicken",
        COW: "Cow",
        CROCODILE: "Crocodile",
        DEER: "Deer",
        DOG: "Dog",
        DOLPHIN: "Dolphin",
        DUCK: "Duck",
        EAGLE: "Eagle",
        ELEPHANT: "Elephant",
        FISH: "Fish",
        FOX: "Fox",
        FROG: "Frog",
        GIRAFFE: "Giraffe",
        HEDGEHOG: "Hedgehog",
        HIPPOPOTAMUS: "Hippopotamus",
        HORSE: "Horse",
        KANGAROO: "Kangaroo",
        KOALA: "Koala",
        LLAMA: "Llama",
        LION: "Lion",
        MONKEY: "Monkey",
        MOUSE: "Mouse",
        OCTOPUS: "Octopus",
        OWL: "Owl",
        PARROT: "Parrot",
        PENGUIN: "Penguin",
        PIG: "Pig",
        RACCOON: "Raccoon",
        RABBIT: "Rabbit",
        SHEEP: "Sheep",
        SKUNK: "Skunk",
        SNAKE: "Snake",
        SQUIRREL: "Squirrel",
        TIGER: "Tiger",
        TURTLE: "Turtle",
        WHALE: "Whale",
        WOLF: "Wolf",
        ZEBRA: "Zebra"
    }

    return animalEnumDisplayNames[animalEnum];
}
