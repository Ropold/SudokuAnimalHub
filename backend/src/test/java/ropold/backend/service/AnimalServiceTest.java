package ropold.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ropold.backend.model.AnimalEnum;
import ropold.backend.model.AnimalModel;
import ropold.backend.repository.AnimalRepository;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.times;

class AnimalServiceTest {
    IdService idService = mock(IdService.class);
    AnimalRepository animalRepository = mock(AnimalRepository.class);
    CloudinaryService cloudinaryService = mock(CloudinaryService.class);
    AnimalService animalService = new AnimalService(idService, animalRepository, cloudinaryService);

    List<AnimalModel> animalModels;

    @BeforeEach
    void setup(){

        AnimalModel animalModel1 = new AnimalModel(
                "1",
                "Lion",
                AnimalEnum.LION,
                "description",
                true,
                "user",
                "https://example.com/lion1.jpg"
        );

        AnimalModel animalModel2 = new AnimalModel(
                "2",
                "Tiger",
                AnimalEnum.TIGER,
                "description",
                true,
                "user",
                "https://example.com/tiger1.jpg"
        );

        animalModels = List.of(animalModel1, animalModel2);
        // Verhalten des Mocks definieren
        when(animalRepository.findAll()).thenReturn(animalModels);
    }

    @Test
    void testGellAllAnimals(){
        List<AnimalModel> result = animalService.getAllAnimals();
        assertEquals(animalModels, result);
    }

    @Test
    void testAddAnimal(){
        AnimalModel animalModel3 = new AnimalModel(
                "3",
                "Elephant",
                AnimalEnum.ELEPHANT,
                "description",
                true,
                "user",
                "https://example.com/elephant1.jpg"
        );

        when(idService.generateRandomId()).thenReturn("3");
        when(animalRepository.save(animalModel3)).thenReturn(animalModel3);

        AnimalModel expected = animalService.addAnimal(animalModel3);

        assertEquals(animalModel3, expected);
        verify(idService, times(1)).generateRandomId();
        verify(animalRepository, times(1)).save(animalModel3);
    }

}
