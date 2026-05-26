package com.example.demo.controllers;

import com.example.demo.dto.UpdateProfileRequest;
import com.example.demo.dto.UserDto;
import com.example.demo.models.User;
import com.example.demo.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    @GetMapping("/profile")
    public ResponseEntity<UserDto> getProfile(HttpServletRequest req) {
        User u = userService.getCurrentUser(req);
        return ResponseEntity.ok(new UserDto(u.getUsername(),u.getEmail(),u.getAboutMe()));
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<UserDto> getProfile(@PathVariable String username,
                                              HttpServletRequest req) {
        User u = userService.findByUsername(username);
        return ResponseEntity.ok(new UserDto(u.getUsername(),u.getEmail(),u.getAboutMe()));
    }

    @PostMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(
            @RequestBody UpdateProfileRequest updateDto, HttpServletRequest req) {
        User u = userService.getCurrentUser(req);
        System.out.println(updateDto.getAboutMe());
        u.setAboutMe(updateDto.getAboutMe());
        userService.save(u);
        return ResponseEntity.ok(new UserDto(u.getUsername(),u.getEmail(),u.getAboutMe()));
    }
}
