package ropold.backend.controller;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import ropold.backend.model.AppUser;
import ropold.backend.model.DifficultyEnum;
import ropold.backend.model.SudokuGridModel;
import ropold.backend.repository.AppUserRepository;
import ropold.backend.repository.SudokuGridRepository;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class SudokuGridControllerIntegrationTest {

    @Autowired
    private SudokuGridRepository sudokuGridRepository;

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        sudokuGridRepository.deleteAll();
        appUserRepository.deleteAll();

        List<List<Integer>> exampleGrid = List.of(
                List.of(0, 0, 0, 0, 0, 0, 0, 0, 0),
                List.of(0, 0, 0, 0, 0, 0, 0, 0, 0),
                List.of(0, 0, 0, 0, 0, 0, 0, 0, 0),
                List.of(0, 0, 0, 0, 0, 0, 0, 0, 0),
                List.of(0, 0, 0, 0, 0, 0, 0, 0, 0),
                List.of(0, 0, 0, 0, 0, 0, 0, 0, 0),
                List.of(0, 0, 0, 0, 0, 0, 0, 0, 0),
                List.of(0, 0, 0, 0, 0, 0, 0, 0, 0),
                List.of(0, 0, 0, 0, 0, 0, 0, 0, 0)
        );

        SudokuGridModel sudokuGridModel1 = new SudokuGridModel(
                "1",
                exampleGrid,
                DifficultyEnum.EASY,
                "user"
        );

        SudokuGridModel sudokuGridModel2 = new SudokuGridModel(
                "2",
                exampleGrid,
                DifficultyEnum.MEDIUM,
                "user"
        );

        sudokuGridRepository.saveAll(List.of(sudokuGridModel1, sudokuGridModel2));

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
    void getAllSudokuGrids_shouldReturnOkAndJsonArray() throws Exception {
        mockMvc.perform(get("/api/sudoku-grid"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void getSudokuGridById_shouldReturnGrid_whenIdExists() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/sudoku-grid/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"))
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.difficultyEnum").value("EASY"))
                .andExpect(jsonPath("$.githubId").value("user"))
                .andExpect(jsonPath("$.grid").isArray())
                .andExpect(jsonPath("$.grid[0]").isArray())
                .andExpect(jsonPath("$.grid[0][0]").value(0));
    }

    @Test
    void postSudokuGrid_shouldAddGrid() throws Exception{
        OAuth2User mockOAuth2User = mock(OAuth2User.class);
        when(mockOAuth2User.getName()).thenReturn("user");


        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mockOAuth2User, null,
                        Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")))
        );

        sudokuGridRepository.deleteAll();

        String sudokuGridJson = """
        {
            "grid": [
                [5, 3, 0, 0, 7, 0, 0, 0, 0],
                [6, 0, 0, 1, 9, 5, 0, 0, 0],
                [0, 9, 8, 0, 0, 0, 0, 6, 0],
                [8, 0, 0, 0, 6, 0, 0, 0, 3],
                [4, 0, 0, 8, 0, 3, 0, 0, 1],
                [7, 0, 0, 0, 2, 0, 0, 0, 6],
                [0, 6, 0, 0, 0, 0, 2, 8, 0],
                [0, 0, 0, 4, 1, 9, 0, 0, 5],
                [0, 0, 0, 0, 8, 0, 0, 7, 9]
            ],
            "difficultyEnum": "MEDIUM"
        }
    """;

        mockMvc.perform(MockMvcRequestBuilders.post("/api/sudoku-grid")
                        .contentType("application/json")
                        .content(sudokuGridJson))
                .andExpect(status().isCreated());

        List<SudokuGridModel> allGrids = sudokuGridRepository.findAll();
        Assertions.assertEquals(1, allGrids.size());
        Assertions.assertEquals(DifficultyEnum.MEDIUM, allGrids.getFirst().difficultyEnum());
    }

}
