package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.model.AppUser;
import ropold.backend.repository.AppUserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AppUserService {

    private final AppUserRepository appUserRepository;

    public AppUser getUserById(String userId) {
        return appUserRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<String> getUserFavoriteAnimals(String userId) {
        AppUser user = getUserById(userId);
        return user.favoriteAnimals();
    }

    public void addAnimalToFavoriteAnimals(String authenticatedUserId, String animalId) {
        AppUser user = getUserById(authenticatedUserId);

        if (!user.favoriteAnimals().contains(animalId)) {
            user.favoriteAnimals().add(animalId);
            appUserRepository.save(user);
        }
    }

    public void removeAnimalFromFavoriteAnimals(String authenticatedUserId, String animalId) {
        AppUser user = getUserById(authenticatedUserId);

        if (user.favoriteAnimals().contains(animalId)) {
            user.favoriteAnimals().remove(animalId);
            appUserRepository.save(user);
        }
    }

    public Map<Integer, String> getAllNumberToAnimalMapping(String userId) {
        AppUser user = getUserById(userId);
        return user.sudokuNumberToAnimal();
    }

    public void saveMapNumberToAnimals(Map<Integer, String> sudokuAnimals, String authenticatedUserId) {
        AppUser user = getUserById(authenticatedUserId);
        Map<Integer, String> updatedMapping = new HashMap<>(user.sudokuNumberToAnimal());
        updatedMapping.clear();
        updatedMapping.putAll(sudokuAnimals);

        AppUser updatedUser = new AppUser(
                user.id(),
                user.username(),
                user.name(),
                user.avatarUrl(),
                user.githubUrl(),
                user.favoriteAnimals(),
                updatedMapping
        );

        appUserRepository.save(updatedUser);
    }

}
