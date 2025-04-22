package ropold.backend.controller;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import ropold.backend.model.AppUser;
import ropold.backend.model.DifficultyEnum;
import ropold.backend.model.SudokuGridModel;
import ropold.backend.repository.AppUserRepository;
import ropold.backend.repository.SudokuGridRepository;

import java.util.List;
import java.util.Map;

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
                "grid1",
                exampleGrid,
                DifficultyEnum.EASY,
                "user"
        );

        SudokuGridModel sudokuGridModel2 = new SudokuGridModel(
                "grid2",
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


}
