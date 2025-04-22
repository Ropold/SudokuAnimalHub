package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.model.SudokuGridModel;
import ropold.backend.repository.SudokuGridRepository;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class SudokuGridService {

    private final IdService idService;
    private final SudokuGridRepository sudokuGridRepository;

    public List<SudokuGridModel> getAllSudokuGrids() {
        return sudokuGridRepository.findAll();
    }

    public SudokuGridModel getSudokuGridById(String id) {
        return sudokuGridRepository.findById(id).orElseThrow(() -> new NoSuchElementException("No SudokuGrid found with Id: " + id));
    }

    public SudokuGridModel addSudokuGrid(SudokuGridModel sudokuGridModel) {
    SudokuGridModel newSudokuGridModel = new SudokuGridModel(
            idService.generateRandomId(),
            sudokuGridModel.grid(),
            sudokuGridModel.difficultyEnum(),
            sudokuGridModel.githubId()
    );
        return sudokuGridRepository.save(newSudokuGridModel);
    }

    public SudokuGridModel updateSudokuGrid(String id, SudokuGridModel sudokuGridModel) {
        if(sudokuGridRepository.existsById(id)){
            SudokuGridModel updatedSudokuGridModel = new SudokuGridModel(
                    id,
                    sudokuGridModel.grid(),
                    sudokuGridModel.difficultyEnum(),
                    sudokuGridModel.githubId()
            );
            return sudokuGridRepository.save(updatedSudokuGridModel);
        }
        throw new NoSuchElementException("No SudokuGrid found with id: " + id);
    }

    public void deleteSudokuGrid(String id) {
        if (!sudokuGridRepository.existsById(id)) {
            throw new NoSuchElementException("No SudokuGrid found with id: " + id);
        }
        sudokuGridRepository.deleteById(id);
    }

}
