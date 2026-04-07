package com.example.demo.services;

import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository;
import com.example.demo.utils.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public User getUserFromToken(String token) {
        Long userId = jwtUtil.extractUserId(token);
        User user = userRepository.findUserById(userId);
        if (user==null) {
            throw new RuntimeException("User not found");
        }
        return user;
    }
}
