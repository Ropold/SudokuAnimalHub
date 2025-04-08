package ropold.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import ropold.backend.model.AnimalModel;

public interface AnimalRepository extends MongoRepository<AnimalModel, String> {
}
