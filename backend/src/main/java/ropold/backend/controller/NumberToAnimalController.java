package ropold.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import ropold.backend.service.NumberToAnimalService;

import java.util.Map;

@RestController
@RequestMapping("/api/number-to-animal")
@RequiredArgsConstructor
public class NumberToAnimalController {

    private final NumberToAnimalService numberToAnimalService;

    @GetMapping
    public Map<Integer, String> getAllNumberToAnimalMapping() {
        return numberToAnimalService.getNumberToAnimalMap();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void saveSudokuAnimals(@RequestBody Map<Integer, String> sudokuAnimals) {
        numberToAnimalService.saveNumberToAnimalsMap(sudokuAnimals);
    }

}
