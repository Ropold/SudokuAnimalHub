import {DifficultyEnum} from "../model/DifficultyEnum.ts";

export function getDifficultyEnumDisplayName(difficultyEnum: DifficultyEnum): string {
    const difficultyEnumDisplayNames: Record<DifficultyEnum, string> = {
        EASY: "Easy",
        MEDIUM: "Medium",
        HARD: "Hard",
    }
    return difficultyEnumDisplayNames[difficultyEnum]
}