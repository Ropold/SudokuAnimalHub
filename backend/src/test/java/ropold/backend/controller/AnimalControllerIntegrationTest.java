package ropold.backend.controller;

import com.cloudinary.Cloudinary;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import ropold.backend.model.AnimalEnum;
import ropold.backend.model.AnimalModel;
import ropold.backend.model.AppUser;
import ropold.backend.repository.AnimalRepository;
import ropold.backend.repository.AppUserRepository;

import java.util.List;

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
                true,
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
                List.of("2")
        );
        appUserRepository.save(user);
    }


}
