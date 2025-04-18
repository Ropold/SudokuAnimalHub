package ropold.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ropold.backend.model.SudokuGridModel;

public interface SudokuGridRepository extends MongoRepository<SudokuGridModel, String> {
}
