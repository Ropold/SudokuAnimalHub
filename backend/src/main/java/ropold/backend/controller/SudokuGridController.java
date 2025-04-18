package ropold.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import ropold.backend.exception.AccessDeniedException;
import ropold.backend.model.SudokuGridModel;
import ropold.backend.service.SudokuGridService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/sudoku-grid")
@RequiredArgsConstructor
public class SudokuGridController {

    private final SudokuGridService sudokuGridService;

    @GetMapping
    public List<SudokuGridModel> getAllSudokuGrids() {
        return sudokuGridService.getAllSudokuGrids();
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public SudokuGridModel addSudokuGrid(@RequestBody SudokuGridModel sudokuGridModel, @AuthenticationPrincipal
    OAuth2User user) throws IOException {
        if (user == null) {
            throw new AccessDeniedException("You do not have permission to add a grid.");
        }
        return sudokuGridService.addSudokuGrid(sudokuGridModel);
    }

    @PutMapping("/{id}")
    public SudokuGridModel updateSudokuGrid(@PathVariable String id, @RequestBody SudokuGridModel sudokuGridModel, @AuthenticationPrincipal OAuth2User user) throws IOException {
       if(user == null) {
            throw new AccessDeniedException("You do not have permission to update a grid.");
        }
        return sudokuGridService.updateSudokuGrid(id, sudokuGridModel);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public void deleteSudokuGrid(@PathVariable String id, @AuthenticationPrincipal OAuth2User user) {
        if (user == null) {
            throw new AccessDeniedException("You do not have permission to delete a grid.");
        }
        sudokuGridService.deleteSudokuGrid(id);
    }
}
