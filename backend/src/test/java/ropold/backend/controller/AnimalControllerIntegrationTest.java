package ropold.backend.controller;

import com.cloudinary.Cloudinary;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import ropold.backend.model.AnimalEnum;
import ropold.backend.model.AnimalModel;
import ropold.backend.model.AppUser;
import ropold.backend.repository.AnimalRepository;
import ropold.backend.repository.AppUserRepository;

import java.util.List;
import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AnimalControllerIntegrationTest {

    @MockBean
    private Cloudinary cloudinary;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private AppUserRepository appUserRepository;

    @BeforeEach
    void setUp() {
        animalRepository.deleteAll();
        appUserRepository.deleteAll();

        AnimalModel animalModel1 = new AnimalModel(
                "1",
                "Lion",
                AnimalEnum.LION,
                "Lions are large carnivorous mammals.",
                false,
                "user",
                "https://example.com/lion.jpg"
        );

        AnimalModel animalModel2 = new AnimalModel(
                "2",
                "Tiger",
                AnimalEnum.TIGER,
                "Tigers are the largest cat species.",
                true,
                "user",
                "https://example.com/tiger.jpg"
        );

        animalRepository.saveAll(List.of(animalModel1, animalModel2));

        AppUser user = new AppUser(
                "user",
                "username",
                "Max Mustermann",
                "https://github.com/avatar",
                "https://github.com/mustermann",
                List.of("2"),
                Map.of(
                        1, "https://example.com/tier1.jpg",
                        2, "https://example.com/tier2.jpg",
                        3, "https://example.com/tier3.jpg",
                        4, "https://example.com/tier4.jpg",
                        5, "https://example.com/tier5.jpg",
                        6, "https://example.com/tier6.jpg",
                        7, "https://example.com/tier7.jpg",
                        8, "https://example.com/tier8.jpg",
                        9, "https://example.com/tier9.jpg"
                )
        );
        appUserRepository.save(user);
    }


    @Test
    void getAllAnimals_shouldReturnAllAnimals() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/sudoku-animal-hub"))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                        [
                            {
                                "id": "1",
                                "name": "Lion",
                                "animalEnum": "LION",
                                "description": "Lions are large carnivorous mammals.",
                                "isActive": false,
                                "githubId": "user",
                                "imageUrl": "https://example.com/lion.jpg"
                            },
                            {
                                "id": "2",
                                "name": "Tiger",
                                "animalEnum": "TIGER",
                                "description": "Tigers are the largest cat species.",
                                "isActive": true,
                                "githubId": "user",
                                "imageUrl": "https://example.com/tiger.jpg"
                            }
                        ]
                        """));
    }

    @Test
    void getActiveAnimals_shouldReturnActiveAnimals() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/sudoku-animal-hub/active"))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                        [
                            {
                                "id": "2",
                                "name": "Tiger",
                                "animalEnum": "TIGER",
                                "description": "Tigers are the largest cat species.",
                                "isActive": true,
                                "githubId": "user",
                                "imageUrl": "https://example.com/tiger.jpg"
                            }
                        ]
                        """));
    }

    @Test
    void getActiveAnimalsByAnimalEnum_shouldReturnActiveAnimalsByAnimalEnum() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/sudoku-animal-hub/active/animal-enum/TIGER"))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                        [
                             {
                                "id": "2",
                                "name": "Tiger",
                                "animalEnum": "TIGER",
                                "description": "Tigers are the largest cat species.",
                                "isActive": true,
                                "githubId": "user",
                                "imageUrl": "https://example.com/tiger.jpg"
                            }
                        ]
                        """));
    }

}
