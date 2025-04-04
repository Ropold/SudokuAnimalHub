package ropold.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import ropold.backend.exception.AccessDeniedException;
import ropold.backend.model.AnimalModel;
import ropold.backend.service.AnimalService;
import ropold.backend.service.AppUserService;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final AnimalService animalService;
    private final AppUserService appUserService;

    @GetMapping(value = "/me", produces = "text/plain")
    public String getMe() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/me/details")
    public Map<String, Object> getUserDetails(@AuthenticationPrincipal OAuth2User user) {
        if (user == null) {
            return Map.of("message", "User not authenticated");
        }
        return user.getAttributes();
    }

    @GetMapping("/favorites")
    public List<AnimalModel> getUserFavorites(@AuthenticationPrincipal OAuth2User authentication) {
        List<String> favoriteAnimalIds = appUserService.getUserFavoriteAnimals(authentication.getName());
        return animalService.getAnimalsByIds(favoriteAnimalIds);
    }

    @GetMapping("/me/my-animals/{githubId}")
    public List<AnimalModel> getAnimalsForGithubUser(@PathVariable String githubId) {
        return animalService.getRevealsForGithubUser(githubId);
    }


    @PostMapping("/favorites/{animalId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void addAnimalToFavorites(@PathVariable String animalId, @AuthenticationPrincipal OAuth2User authentication) {
        String authenticatedUserId = authentication.getName();
        appUserService.addAnimalToFavoriteAnimals(authenticatedUserId, animalId);
    }

    @DeleteMapping("/favorites/{animalId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeAnimalFromFavorites(@PathVariable String animalId, @AuthenticationPrincipal OAuth2User authentication) {
        String authenticatedUserId = authentication.getName();
        appUserService.removeAnimalFromFavoriteAnimals(authenticatedUserId, animalId);
    }

    @PutMapping("/{id}/toggle-active")
    public AnimalModel toggleAnimalActive(@PathVariable String id, @AuthenticationPrincipal OAuth2User authentication) {
        String authenticatedUserId = authentication.getName();

        AnimalModel animalModel = animalService.getAnimalById(id);
        if (!animalModel.githubId().equals(authenticatedUserId)) {
            throw new AccessDeniedException("You do not have permission to toggle this animal.");
        }
        return animalService.toggleAnimalActive(id);
    }

    @GetMapping("numbers-to-animal")
    public Map<Integer, String> getAllNumberToAnimalMapping(@AuthenticationPrincipal OAuth2User authentication) {
        return appUserService.getAllNumberToAnimalMapping(authentication.getName());
    }

    @PostMapping("/numbers-to-animal")
    @ResponseStatus(HttpStatus.CREATED)
    public void saveNumberToAnimalsMap(@RequestBody Map<Integer, String> sudokuAnimals, @AuthenticationPrincipal OAuth2User authentication) {
        String authenticatedUserId = authentication.getName();
        appUserService.saveMapNumberToAnimals(sudokuAnimals, authenticatedUserId);
    }


}
