package ropold.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ropold.backend.model.DifficultyEnum;
import ropold.backend.model.SudokuGridModel;
import ropold.backend.repository.SudokuGridRepository;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class SudokuGridServiceTest {

    IdService idService = mock(IdService.class);
    SudokuGridRepository sudokuGridRepository = mock(SudokuGridRepository.class);
    SudokuGridService sudokuGridService = new SudokuGridService(idService, sudokuGridRepository);

    List<SudokuGridModel> sudokuGridModels;

    @BeforeEach
    void setup() {
        List<List<Integer>> dummyGrid = List.of(
                List.of(5, 3, 0, 0, 7, 0, 0, 0, 0),
                List.of(6, 0, 0, 1, 9, 5, 0, 0, 0),
                List.of(0, 9, 8, 0, 0, 0, 0, 6, 0),
                List.of(8, 0, 0, 0, 6, 0, 0, 0, 3),
                List.of(4, 0, 0, 8, 0, 3, 0, 0, 1),
                List.of(7, 0, 0, 0, 2, 0, 0, 0, 6),
                List.of(0, 6, 0, 0, 0, 0, 2, 8, 0),
                List.of(0, 0, 0, 4, 1, 9, 0, 0, 5),
                List.of(0, 0, 0, 0, 8, 0, 0, 7, 9)
        );

        SudokuGridModel sudokuGridModel1 = new SudokuGridModel(
                "1",
                dummyGrid,
                dummyGrid,
                DifficultyEnum.EASY,
                "123456"
        );

        SudokuGridModel sudokuGridModel2 = new SudokuGridModel(
                "2",
                dummyGrid,
                dummyGrid,
                DifficultyEnum.HARD,
                "654321"
        );

        sudokuGridModels = List.of(sudokuGridModel1, sudokuGridModel2);
        when(sudokuGridRepository.findAll()).thenReturn(sudokuGridModels);
    }

    @Test
    void testGetAllSudokuGrids() {
        List<SudokuGridModel> result = sudokuGridService.getAllSudokuGrids();
        assertEquals(sudokuGridModels, result);
    }

    @Test
    void testGetSudokuGridById() {
        SudokuGridModel expected = sudokuGridModels.getFirst();
        when(sudokuGridRepository.findById("1")).thenReturn(java.util.Optional.of(expected));
        SudokuGridModel result = sudokuGridService.getSudokuGridById("1");
        assertEquals(expected, result);
    }

    @Test
    void testAddSudokuGrid(){
        SudokuGridModel sudokuGridModel3 = new SudokuGridModel(
                "3",
                List.of(
                        List.of(1, 2, 3, 4, 5, 6, 7, 8, 9),
                        List.of(1, 2, 3, 4, 5, 6, 7, 8, 9),
                        List.of(1, 2, 3, 4, 5, 6, 7, 8, 9),
                        List.of(1, 2, 3, 4, 5, 6, 7, 8, 9),
                        List.of(1, 2, 3, 4, 5, 6, 7, 8, 9),
                        List.of(1, 2, 3, 4, 5, 6, 7, 8, 9),
                        List.of(1, 2, 3, 4, 5, 6, 7, 8 ,9),
                        List.of(1 ,2 ,3 ,4 ,5 ,6 ,7 ,8 ,9),
                        List.of(1 ,2 ,3 ,4 ,5 ,6 ,7 ,8 ,9)
                ),
                List.of(
                        List.of(1, 2, 3, 4, 5, 6, 7, 8, 9),
                        List.of(1, 2, 3, 4, 5, 6, 7, 8, 9),
                        List.of(1, 2, 3, 4, 5, 6, 7, 8, 9),
                        List.of(1, 2, 3, 4, 5, 6, 7, 8, 9),
                        List.of(1, 2, 3, 4, 5, 6, 7, 8, 9),
                        List.of(1, 2, 3, 4, 5, 6, 7, 8, 9),
                        List.of(1, 2, 3, 4, 5, 6, 7, 8 ,9),
                        List.of(1 ,2 ,3 ,4 ,5 ,6 ,7 ,8 ,9),
                        List.of(1 ,2 ,3 ,4 ,5 ,6 ,7 ,8 ,9)
                ),
                DifficultyEnum.EASY,
                "123456"
        );

        when(idService.generateRandomId()).thenReturn("3");
        when(sudokuGridRepository.save(sudokuGridModel3)).thenReturn(sudokuGridModel3);

        SudokuGridModel expected = sudokuGridService.addSudokuGrid(sudokuGridModel3);

        assertEquals(sudokuGridModel3, expected);
        verify(idService, times(1)).generateRandomId();
        verify(sudokuGridRepository, times(1)).save(sudokuGridModel3);
    }

    @Test
    void testUpdateSudokuGrid(){
        SudokuGridModel updatedSudokuGridModel = new SudokuGridModel(
                "1",
                List.of(
                        List.of(1, 2, 3, 4, 5, 6, 7, 8, 9),
                        List.of(1, 2, 3, 4, 5, 6, 7, 8, 9),
                        List.of(1, 2, 3, 4, 5, 6, 7, 8, 9),
                        List.of(1, 2, 3, 4, 5, 6, 7, 8 ,9),
                        List.of(1 ,2 ,3 ,4 ,5 ,6 ,7 ,8 ,9),
                        List.of(1 ,2 ,3 ,4 ,5 ,6 ,7 ,8 ,9),
                        List.of(1 ,2 ,3 ,4 ,5 ,6 ,7 ,8 ,9),
                        List.of(1 ,2 ,3 ,4 ,5 ,6 ,7 ,8 ,9),
                        List.of(1 ,2 ,3 ,4 ,5 ,6 ,7 ,8 ,9)
                ),
                List.of(
                        List.of(1, 2, 3, 4, 5, 6, 7, 8, 9),
                        List.of(1, 2, 3, 4, 5, 6, 7, 8, 9),
                        List.of(1, 2, 3, 4, 5, 6, 7, 8, 9),
                        List.of(1, 2, 3, 4, 5, 6, 7, 8, 9),
                        List.of(1, 2, 3, 4, 5, 6, 7, 8, 9),
                        List.of(1, 2, 3, 4, 5, 6, 7, 8, 9),
                        List.of(1, 2, 3, 4, 5, 6, 7, 8 ,9),
                        List.of(1 ,2 ,3 ,4 ,5 ,6 ,7 ,8 ,9),
                        List.of(1 ,2 ,3 ,4 ,5 ,6 ,7 ,8 ,9)
                ),
                DifficultyEnum.EASY,
                "123456"
        );

        when(sudokuGridRepository.existsById("1")).thenReturn(true);
        when(sudokuGridRepository.save(updatedSudokuGridModel)).thenReturn(updatedSudokuGridModel);

        SudokuGridModel result = sudokuGridService.updateSudokuGrid("1", updatedSudokuGridModel);

        assertEquals(updatedSudokuGridModel, result);
        verify(sudokuGridRepository, times(1)).save(updatedSudokuGridModel);
    }

    @Test
    void testDeleteSudokuGrid(){
        SudokuGridModel sudokuGridModel = sudokuGridModels.getFirst();
        when(sudokuGridRepository.findById("1")).thenReturn(java.util.Optional.of(sudokuGridModel));
        when(sudokuGridRepository.existsById("1")).thenReturn(true);
        sudokuGridService.deleteSudokuGrid("1");
        verify(sudokuGridRepository, times(1)).deleteById("1");
    }
}
