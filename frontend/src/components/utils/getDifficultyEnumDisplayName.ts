import {DifficultyEnum} from "../model/DifficultyEnum.ts";

export function getDifficultyEnumDisplayName(difficultyEnum: DifficultyEnum): string {
    const difficultyEnumDisplayNames: Record<DifficultyEnum, string> = {
        EASY: "Easy",
        MEDIUM: "Medium",
        HARD: "Hard",
        EVIL: "Evil",
    }
    return difficultyEnumDisplayNames[difficultyEnum]
}