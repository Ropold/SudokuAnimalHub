package ropold.backend.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import ropold.backend.model.AnimalEnum;
import ropold.backend.model.AnimalModel;
import ropold.backend.model.AppUser;
import ropold.backend.repository.AnimalRepository;
import ropold.backend.repository.AppUserRepository;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

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
    void getActiveEnums_shouldReturnActiveAnimalEnums() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/sudoku-animal-hub/active/animal-enum"))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                        [
                            "TIGER"
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

    @Test
    void getAnimalById_shouldReturnAnimalById() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/sudoku-animal-hub/1"))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                        {
                            "id": "1",
                            "name": "Lion",
                            "animalEnum": "LION",
                            "description": "Lions are large carnivorous mammals.",
                            "isActive": false,
                            "githubId": "user",
                            "imageUrl": "https://example.com/lion.jpg"
                        }
                        """));
    }

    @Test
    void postAnimal_shouldAddAnimal()throws Exception{
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("user");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockOAuth2User, null,
                        Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")))
        );
        animalRepository.deleteAll();

        Uploader mockUploader = mock(Uploader.class);
        when(mockUploader.upload(any(), anyMap())).thenReturn(Map.of("secure_url", "https://www.test.de/"));
        when(cloudinary.uploader()).thenReturn(mockUploader);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/sudoku-animal-hub")
                        .file(new MockMultipartFile("image", "image.jpg", "image/jpeg", "image".getBytes()))
                        .file(new MockMultipartFile("animalModelDto", "", "application/json", """
                        {
                            "name": "Lion King",
                            "animalEnum": "LION",
                            "description": "Lions are large carnivorous mammals.",
                            "isActive": true,
                            "githubId": "user",
                            "imageUrl": "https://example.com/Lion1.jpg"
                        }
                        """.getBytes())))
                .andExpect(status().isCreated());

        List<AnimalModel> allReveals = animalRepository.findAll();
        Assertions.assertEquals(1, allReveals.size());

        AnimalModel savedAnimal = allReveals.getFirst();
        org.assertj.core.api.Assertions.assertThat(savedAnimal)
                .usingRecursiveComparison()
                .ignoringFields("id", "imageUrl")
                .isEqualTo(new AnimalModel(
                        null,
                        "Lion King",
                        AnimalEnum.LION,
                        "Lions are large carnivorous mammals.",
                        true,
                        "user",
                        "https://example.com/Lion1.jpg"
                ));
    }

    @Test
    void updateWithPut_shouldReturnUpdatedAnimal() throws Exception{
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("user");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockOAuth2User, null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")))
        );

        Uploader mockUploader = mock(Uploader.class);
        when(mockUploader.upload(any(), anyMap())).thenReturn(Map.of("secure_url", "https://example.com/updated-image.jpg"));
        when(cloudinary.uploader()).thenReturn(mockUploader);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/sudoku-animal-hub/1")
                        .file(new MockMultipartFile("image", "image.jpg", "image/jpeg", "image".getBytes()))
                        .file(new MockMultipartFile("animalModelDto", "", "application/json", """
                        {
                            "name": "Updated Lion King",
                            "animalEnum": "LION",
                            "description": "A brief description",
                            "isActive": true,
                            "githubId": "user",
                            "imageUrl": "https://example.com/updated-image.jpg"
                        }
                    """.getBytes()))
                        .contentType("multipart/form-data")
                        .with(request -> { request.setMethod("PUT"); return request; }))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Lion King"))
                .andExpect(jsonPath("$.imageUrl").value("https://example.com/updated-image.jpg"));

        Assertions.assertEquals("Updated Lion King", animalRepository.findById("1").orElseThrow().name());
    }

    @Test
    void deleteAnimal_shouldDeleteAnimal() throws Exception{

        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("user");

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockOAuth2User, null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")))
        );

        Uploader mockUploader = mock(Uploader.class);
        when(mockUploader.upload(any(), anyMap())).thenReturn(Map.of("secure_url", "https://example.com/updated-image.jpg"));
        when(cloudinary.uploader()).thenReturn(mockUploader);

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/sudoku-animal-hub/1"))
                .andExpect(status().isNoContent());

        Assertions.assertTrue(animalRepository.findById("1").isEmpty());
        verify(mockUploader).destroy(eq("lion"), anyMap());
    }
}
