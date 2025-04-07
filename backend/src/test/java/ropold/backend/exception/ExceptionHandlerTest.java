package ropold.backend.exception;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import ropold.backend.repository.AnimalRepository;
import ropold.backend.service.AnimalService;

import java.util.Collections;
import java.util.Map;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ExceptionHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private Cloudinary cloudinary;

    @Autowired
    private AnimalRepository animalRepository;

    @MockBean
    private AnimalService animalService;

    @Test
    void whenRevealNotFoundException_thenReturnsNotFound() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/sudoku-animal-hub/{id}", "non-existing-id"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("No Animal found with id: non-existing-id"));
    }

    @Test
    @WithMockUser(username = "user")
    void postAnimal_shouldFailValidation_whenFieldsAreInvalid() throws Exception {

        animalRepository.deleteAll();

        Uploader mockUploader = mock(Uploader.class);
        when(mockUploader.upload(any(), any())).thenReturn(Map.of("secure_url", "https://example.com/image1.jpg"));
        when(cloudinary.uploader()).thenReturn(mockUploader);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/sudoku-animal-hub")
                        .file(new MockMultipartFile("image", "image.jpg", "image/jpeg", "image".getBytes()))
                        .file(new MockMultipartFile("animalModelDto", "", "application/json", """
                                    {
                                        "name": "Li",
                                        "animalEnum": "LION",
                                        "description": "Sample description.",
                                        "isActive": true,
                                        "GithubId": "user",
                                        "imageUrl": ""
                                    }
                                """.getBytes())))
                .andExpect(status().isBadRequest())
                .andExpect(MockMvcResultMatchers.content().json("""
                {
                "imageUrl":"Image URL cannot be blank","name":"Name must be at least 3 characters long"
                }
            """));
    }

    @Test
    @WithMockUser(username = "user")
    void postAnimal_shouldReturnAccessDenied_whenUserIsNotAuthorized() throws Exception {

        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("user");

        SecurityContextHolder.getContext().setAuthentication(
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(mockOAuth2User, null,
                        Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"))));

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/sudoku-animal-hub")
                        .file(new MockMultipartFile("image", "image.jpg", "image/jpeg", "image".getBytes()))
                        .file(new MockMultipartFile("animalModelDto", "", "application/json", """
                    {
                        "name": "Lion",
                        "animalEnum": "LION",
                        "description": "Sample description.",
                        "isActive": true,
                        "GithubId": "anotherUser",
                        "imageUrl": "image.com"
                    }
                """.getBytes())))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message", is("You do not have permission to add this animal.")))
                .andReturn();
    }

}
