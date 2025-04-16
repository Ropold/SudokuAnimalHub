package ropold.backend.controller;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import ropold.backend.model.AnimalEnum;
import ropold.backend.model.AnimalModel;
import ropold.backend.model.AppUser;
import ropold.backend.repository.AnimalRepository;
import ropold.backend.repository.AppUserRepository;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AppUserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @BeforeEach
    void setUp() {
        appUserRepository.deleteAll();
        animalRepository.deleteAll();

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

        animalRepository.saveAll(List.of(
                new AnimalModel("1", "Lion", AnimalEnum.LION, "description", true, "user", "https://example.com/Lion1.jpg"),
                new AnimalModel("2", "Tiger", AnimalEnum.TIGER, "description", true, "user", "https://example.com/tiger1.jpg")
        ));
    }

    @Test
    void testGetMe_withLoggedInUser_expectUsername() throws Exception {
        // Erstellen eines Mock OAuth2User
        OAuth2User mockUser = mock(OAuth2User.class);
        when(mockUser.getName()).thenReturn("user");

        // Simuliere den OAuth2User in der SecurityContext
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        Authentication authentication = new UsernamePasswordAuthenticationToken(mockUser, null, mockUser.getAuthorities());
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(content().string("user"));
    }
    @Test
    void testGetMe_withoutLogin_expectAnonymousUsername() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(content().string("anonymousUser"));
    }


    @Test
    void testGetUserDetails_withLoggedInUser_expectUserDetails() throws Exception {
        // Erstellen eines Mock OAuth2User
        OAuth2User mockUser = mock(OAuth2User.class);
        when(mockUser.getAttributes()).thenReturn(Map.of(
                "login", "username",
                "name", "max mustermann",
                "avatar_url", "https://github.com/avatar",
                "html_url", "https://github.com/mustermann"
        ));

        // Simuliere den OAuth2User in der SecurityContext
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        Authentication authentication = new UsernamePasswordAuthenticationToken(mockUser, null, mockUser.getAuthorities());
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        mockMvc.perform(get("/api/users/me/details"))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                {
                    "login": "username",
                    "name": "max mustermann",
                    "avatar_url": "https://github.com/avatar",
                    "html_url": "https://github.com/mustermann"
                }
            """));
    }

    @Test
    void testGetUserDetails_withoutLogin_expectErrorMessage() throws Exception {
        mockMvc.perform(get("/api/users/me/details"))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                {
                    "message": "User not authenticated"
                }
            """));
    }

    @Test
    void getAllNumberToAnimalsMapping_shouldReturnAllMappings() throws Exception {
        // Erstellen eines Mock OAuth2User
        OAuth2User mockUser = mock(OAuth2User.class);
        when(mockUser.getName()).thenReturn("user");

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        Authentication authentication = new UsernamePasswordAuthenticationToken(mockUser, null, mockUser.getAuthorities());
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        mockMvc.perform(MockMvcRequestBuilders.get("/api/users/numbers-to-animal"))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("""
                {
                    "1": "https://example.com/tier1.jpg",
                    "2": "https://example.com/tier2.jpg",
                    "3": "https://example.com/tier3.jpg",
                    "4": "https://example.com/tier4.jpg",
                    "5": "https://example.com/tier5.jpg",
                    "6": "https://example.com/tier6.jpg",
                    "7": "https://example.com/tier7.jpg",
                    "8": "https://example.com/tier8.jpg",
                    "9": "https://example.com/tier9.jpg"
                }
            """));
    }

    @Test
    void saveMapNumberToAnimals_shouldReturnSavedMap() throws Exception {
        // Erstellen eines Mock OAuth2User
        OAuth2User mockUser = mock(OAuth2User.class);
        when(mockUser.getName()).thenReturn("user");

        // Simuliere den OAuth2User in der SecurityContext
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        Authentication authentication = new UsernamePasswordAuthenticationToken(mockUser, null, mockUser.getAuthorities());
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        String json = """
                {
                    "1": "https://example.com/tier1.jpg",
                    "2": "https://example.com/tier2.jpg",
                    "3": "https://example.com/tier3.jpg",
                    "4": "https://example.com/tier4.jpg",
                    "5": "https://example.com/tier5.jpg",
                    "6": "https://example.com/tier6.jpg",
                    "7": "https://example.com/tier7.jpg",
                    "8": "https://example.com/tier8.jpg",
                    "9": "https://example.com/tier9.jpg"
                }
            """;
        mockMvc.perform(MockMvcRequestBuilders.post("/api/users/numbers-to-animal")
                        .contentType("application/json")
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(MockMvcResultMatchers.content().string(""));
    }

    @Test
    void TestGetAnimalsForGithubUser_ShouldReturnAnimalsForGithubUser() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/users/me/my-animals/user")
                        .with(oidcLogin().idToken(i -> i.claim("sub", "user")))
                )
                .andExpect(status().isOk())
                .andExpect(content().json("""
                [
                    {
                        "id": "1",
                        "name": "Lion",
                        "animalEnum": "LION",
                        "description": "description",
                        "isActive": true,
                        "githubId": "user",
                        "imageUrl": "https://example.com/Lion1.jpg"
                    },
                    {
                        "id": "2",
                        "name": "Tiger",
                        "animalEnum": "TIGER",
                        "description": "description",
                        "isActive": true,
                        "githubId": "user",
                        "imageUrl": "https://example.com/tiger1.jpg"
                    }
                ]
            """));
    }

    @Test
    @WithMockUser(username = "user")
    void getUserFavorites_shouldReturnUserFavorites() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/users/favorites")
                        .with(oidcLogin().idToken(i -> i.claim("sub", "user"))))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                [
                    {
                        "id": "2",
                        "name": "Tiger",
                        "animalEnum": "TIGER",
                        "description": "description",
                        "isActive": true,
                        "githubId": "user",
                        "imageUrl": "https://example.com/tiger1.jpg"
                    }
                ]
            """));
    }

    @Test
    void addAnimalToFavorites_shouldAddAnimalAndReturnFavorites() throws Exception {
        AppUser userBefore = appUserRepository.findById("user").orElseThrow();
        Assertions.assertFalse(userBefore.favoriteAnimals().contains("1"));

        mockMvc.perform(MockMvcRequestBuilders.post("/api/users/favorites/1")
                        .with(oidcLogin().idToken(i -> i.claim("sub", "user"))))
                .andExpect(status().isCreated());

        AppUser updatedUser = appUserRepository.findById("user").orElseThrow();
        Assertions.assertTrue(updatedUser.favoriteAnimals().contains("1"));
    }

    @Test
    void removeAnimalFromFavorites_shouldRemoveAnimalAndReturnFavorites() throws Exception {
        AppUser userBefore = appUserRepository.findById("user").orElseThrow();
        Assertions.assertTrue(userBefore.favoriteAnimals().contains("2"));

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/users/favorites/2")
                        .with(oidcLogin().idToken(i -> i.claim("sub", "user")))
                )
                .andExpect(status().isNoContent()); // .isOk = 200, .isNoContent = 204

        AppUser updatedUser = appUserRepository.findById("user").orElseThrow();
        Assertions.assertFalse(updatedUser.favoriteAnimals().contains("2"));
    }

    @Test
    void ToggleActiveStatus_shouldToggleActiveStatus() throws Exception {
        AnimalModel memoryBefore = animalRepository.findById("1").orElseThrow();
        Assertions.assertTrue(memoryBefore.isActive());

        mockMvc.perform(MockMvcRequestBuilders.put("/api/users/1/toggle-active")
                        .with(oidcLogin().idToken(i -> i.claim("sub", "user")))
                )
                .andExpect(status().isOk());

        AnimalModel updatedMemory = animalRepository.findById("1").orElseThrow();
        Assertions.assertFalse(updatedMemory.isActive());
    }

}
