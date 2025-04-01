package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.exception.AnimalNotFoundException;
import ropold.backend.model.AnimalModel;
import ropold.backend.repository.AnimalRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnimalService {

    private final IdService idService;
    private final AnimalRepository animalRepository;

    public List<AnimalModel> getAllAnimals() {
        return animalRepository.findAll();
    }

    public AnimalModel addAnimal(AnimalModel animalModel) {
        AnimalModel newAnimalModel = new AnimalModel(
                idService.generateRandomId(),
                animalModel.name(),
                animalModel.animalEnum(),
                animalModel.description(),
                animalModel.isActive(),
                animalModel.githubId(),
                animalModel.imageUrl()
        );
        return animalRepository.save(newAnimalModel);
    }


    public void deleteAnimal(String id) {
        AnimalModel animalModel = animalRepository.findById(id).orElseThrow(() -> new AnimalNotFoundException("No Animal found with id: " + id));

//        if(animalModel.imageUrl() != null) {
//            cloudinaryService.deleteImage(animalModel.imageUrl());
//        }

        animalRepository.deleteById(id);
    }
}
