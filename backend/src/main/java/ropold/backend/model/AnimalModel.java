package ropold.backend.model;

public record AnimalModel(
        String id,
        String name,
        AnimalEnum animalEnum,
        String description,
        boolean isActive,
        String githubId,
        String imageUrl
) {
}
