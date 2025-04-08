package ropold.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AnimalModelDto(
        @NotBlank
        @Size(min = 3, message = "Name must be at least 3 characters long")
        String name,

        @NotNull(message = "Animal Category is required")
        AnimalEnum animalEnum,

        String description,
        boolean isActive,
        String githubId,

        @NotBlank(message = "Image URL cannot be blank")
        String imageUrl
) {
}
