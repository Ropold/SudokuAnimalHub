package ropold.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import ropold.backend.model.AnimalModel;
import ropold.backend.model.AnimalModelDto;
import ropold.backend.service.AnimalService;

import java.util.List;

@RestController
@RequestMapping("/api/sudoku-animal-hub")
@RequiredArgsConstructor
public class AnimalController {

    private final AnimalService animalService;

    @GetMapping
    public List<AnimalModel> getAllAnimals() {
        return animalService.getAllAnimals();
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

    @DeleteMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAnimal(@PathVariable String id) {
        animalService.deleteAnimal(id);
    }


}
