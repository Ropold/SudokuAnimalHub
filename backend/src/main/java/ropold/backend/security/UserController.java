package ropold.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ropold.backend.model.AnimalModel;
import ropold.backend.service.AnimalService;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final AnimalService animalService;

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

    @GetMapping("/me/my-animals/{githubId}")
    public List<AnimalModel> getAnimalsForGithubUser(@PathVariable String githubId) {
        return animalService.getRevealsForGithubUser(githubId);
    }

}
