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

    @Test
    void testGetActiveAnimals(){
        List<AnimalModel> result = animalService.getActiveAnimals();
        assertEquals(animalModels, result);
    }

    @Test
    void testGetAnimalById(){
        AnimalModel expected = animalModels.getFirst();
        when(animalRepository.findById("1")).thenReturn(java.util.Optional.of(expected));
        AnimalModel result = animalService.getAnimalById("1");
        assertEquals(expected, result);
    }

    @Test
    void testDeleteAnimal(){
        AnimalModel animalModel = animalModels.getFirst();
        when(animalRepository.findById("1")).thenReturn(java.util.Optional.of(animalModel));
        animalService.deleteAnimal("1");
        verify(animalRepository, times(1)).deleteById("1");
        verify(cloudinaryService, times(1)).deleteImage(animalModel.imageUrl());
    }

    @Test
    void testUpdateAnimal(){
        AnimalModel updatedAnimalModel = new AnimalModel(
                "1",
                "Lion",
                AnimalEnum.LION,
                "updated description",
                true,
                "user",
                "https://example.com/lion1.jpg"
        );

        when(animalRepository.existsById("1")).thenReturn(true);
        when(animalRepository.save(updatedAnimalModel)).thenReturn(updatedAnimalModel);

        AnimalModel result = animalService.updateAnimal("1", updatedAnimalModel);
        assertEquals(updatedAnimalModel, result);
        verify(animalRepository, times(1)).existsById("1");

    }

}
