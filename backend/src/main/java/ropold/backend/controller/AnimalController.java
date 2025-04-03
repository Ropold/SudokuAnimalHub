package ropold.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ropold.backend.exception.AccessDeniedException;
import ropold.backend.model.AnimalModel;
import ropold.backend.model.AnimalModelDto;
import ropold.backend.service.AnimalService;
import ropold.backend.service.AppUserService;
import ropold.backend.service.CloudinaryService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/sudoku-animal-hub")
@RequiredArgsConstructor
public class AnimalController {

    private final AnimalService animalService;
    private final CloudinaryService cloudinaryService;

    @GetMapping
    public List<AnimalModel> getAllAnimals() {
        return animalService.getAllAnimals();
    }

    @GetMapping("/active/animal-enum/{animalEnum}")
    public List<AnimalModel> getActiveAnimalsByAnimalEnum(@PathVariable String animalEnum) {
        return animalService.getActiveAnimalsByAnimalEnum(animalEnum);
    }

    @GetMapping("/active/animal-enum")
    public List<String> getActiveAnimalEnums() {
        return animalService.getActiveAnimalEnums();
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/test-add")
    public AnimalModel addTestAnimal(@RequestBody AnimalModelDto animalModelDto) {
        return animalService.addAnimal(
                new AnimalModel(
                        null,
                        animalModelDto.name(),
                        animalModelDto.animalEnum(),
                        animalModelDto.description(),
                        animalModelDto.isActive(),
                        animalModelDto.githubId(),
                        animalModelDto.imageUrl()
                ));
    }

    @GetMapping("/active")
    public List<AnimalModel> getActiveAnimals() {
        return animalService.getActiveAnimals();
    }

    @GetMapping("/{id}")
    public AnimalModel getAnimalById(@PathVariable String id) {
        AnimalModel animal = animalService.getAnimalById(id);
        if (animal == null) {
            throw new AccessDeniedException("No Animal found with id: " + id);
        }
        return animal;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping()
    public AnimalModel addAnimal(
            @RequestPart("animalModelDto") @Valid AnimalModelDto animalModelDto,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal OAuth2User authentication) throws IOException {

        String authenticatedUserId = authentication.getName();
        if (!authenticatedUserId.equals(animalModelDto.githubId())) {
            throw new AccessDeniedException("You do not have permission to add this animal.");
        }

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = cloudinaryService.uploadImage(image);
        }

        return animalService.addAnimal(
                new AnimalModel(
                        null,
                        animalModelDto.name(),
                        animalModelDto.animalEnum(),
                        animalModelDto.description(),
                        animalModelDto.isActive(),
                        animalModelDto.githubId(),
                        imageUrl
                ));
    }

    @PutMapping("/{id}")
    public AnimalModel updateAnimal(
            @PathVariable String id,
            @RequestPart("animalModelDto") @Valid AnimalModelDto animalModelDto,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal OAuth2User authentication) throws IOException {

        String authenticatedUserId = authentication.getName();
        AnimalModel existingAnimal = animalService.getAnimalById(id);

        if (!authenticatedUserId.equals(existingAnimal.githubId())) {
            throw new AccessDeniedException("You do not have permission to update this animal.");
        }

        String newImageUrl;
        if (image != null && !image.isEmpty()) {
            newImageUrl = cloudinaryService.uploadImage(image);
        } else {
            newImageUrl = existingAnimal.imageUrl();
        }

        return animalService.updateAnimal(
                id,
                new AnimalModel(
                        id,
                        animalModelDto.name(),
                        animalModelDto.animalEnum(),
                        animalModelDto.description(),
                        animalModelDto.isActive(),
                        animalModelDto.githubId(),
                        newImageUrl
                ));
    }


    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAnimal(@PathVariable String id, @AuthenticationPrincipal OAuth2User authentication) {
        String authenticatedUserId = authentication.getName();

        AnimalModel animalModel = animalService.getAnimalById(id);
        if (!animalModel.githubId().equals(authenticatedUserId)) {
            throw new AccessDeniedException("You do not have permission to delete this animal.");
        }
        animalService.deleteAnimal(id);
    }

}
