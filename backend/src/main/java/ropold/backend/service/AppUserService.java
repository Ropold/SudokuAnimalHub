package ropold.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ropold.backend.model.AppUser;
import ropold.backend.repository.AppUserRepository;

import java.util.List;

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

    public void addAnimalToFavoriteAnimals(String authenticatedUserId, String revealId) {
        AppUser user = getUserById(authenticatedUserId);

        if (!user.favoriteAnimals().contains(revealId)) {
            user.favoriteAnimals().add(revealId);
            appUserRepository.save(user);
        }
    }

    public void removeAnimalFromFavoriteAnimals(String authenticatedUserId, String revealId) {
        AppUser user = getUserById(authenticatedUserId);

        if (user.favoriteAnimals().contains(revealId)) {
            user.favoriteAnimals().remove(revealId);
            appUserRepository.save(user);
        }
    }
}
