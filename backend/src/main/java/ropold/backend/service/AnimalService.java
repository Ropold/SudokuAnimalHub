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
    private final CloudinaryService cloudinaryService;

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

    public AnimalModel updateAnimal(String id, AnimalModel animalModel) {
        if(animalRepository.existsById(id)){
            AnimalModel updatedAnimalModel = new AnimalModel(
                    id,
                    animalModel.name(),
                    animalModel.animalEnum(),
                    animalModel.description(),
                    animalModel.isActive(),
                    animalModel.githubId(),
                    animalModel.imageUrl()
            );
            return animalRepository.save(updatedAnimalModel);
        }
        throw new AnimalNotFoundException("No Animal found with id: " + id);
    }


    public void deleteAnimal(String id) {
        AnimalModel animalModel = animalRepository.findById(id).orElseThrow(() -> new AnimalNotFoundException("No Animal found with id: " + id));

        if(animalModel.imageUrl() != null) {
            cloudinaryService.deleteImage(animalModel.imageUrl());
        }

        animalRepository.deleteById(id);
    }


    public AnimalModel getAnimalById(String id) {
        return animalRepository.findById(id).orElseThrow(() -> new AnimalNotFoundException("No Animal found with id: " + id));
    }

    public List<AnimalModel> getAnimalsByIds(List<String> favoriteAnimalIds) {
        return animalRepository.findAllById(favoriteAnimalIds);
    }

    public AnimalModel toggleAnimalActive(String id) {
        AnimalModel animalModel = animalRepository.findById(id).orElseThrow(() -> new AnimalNotFoundException("No Animal found with id: " + id));

        AnimalModel updatedAnimalModel = new AnimalModel(
                animalModel.id(),
                animalModel.name(),
                animalModel.animalEnum(),
                animalModel.description(),
                !animalModel.isActive(),
                animalModel.githubId(),
                animalModel.imageUrl()
        );
        return animalRepository.save(updatedAnimalModel);
    }


    public List<AnimalModel> getActiveAnimals() {
        return animalRepository.findAll().stream()
                .filter(AnimalModel::isActive)
                .toList();
    }


    public List<AnimalModel> getActiveAnimalsByAnimalEnum(String animalEnum) {
        return animalRepository.findAll().stream()
                .filter(AnimalModel::isActive)
                .filter(animalModel -> animalModel.animalEnum().name().equalsIgnoreCase(animalEnum))
                .toList();
    }

    public List<String> getActiveAnimalEnums() {
        return animalRepository.findAll().stream()
                .filter(AnimalModel::isActive)
                .map(animalModel -> animalModel.animalEnum().name())
                .distinct()
                .toList();
    }


}
