import {animalsEnumImages} from "./AnimalEnumImages.ts";
import { AnimalEnum } from "../model/AnimalEnum.ts";

export function ResolveImageUrl(value: number, deckMapping: { [key: number]: string }) {
    const entry = deckMapping[value];
    if (!entry) return null;
    if (entry.startsWith("http")) {
        return entry; // echte URL
    }
    return animalsEnumImages[entry as AnimalEnum];
}