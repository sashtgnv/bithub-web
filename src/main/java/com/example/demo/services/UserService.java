package com.example.demo.services;

import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository;
import com.example.demo.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    // Вспомогательный метод: извлечь пользователя из токена
    public User getCurrentUser(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            if (jwtUtil.validateToken(token)) {
                return getUserFromToken(token);
            }
        }
        throw new RuntimeException("Unauthorized");
    }

    public User getUserFromToken(String token) {
        Long userId = jwtUtil.extractUserId(token);
        User user = userRepository.findUserById(userId);
        if (user==null) {
            throw new RuntimeException("User not found");
        }
        return user;
    }

    public User findByUsername(String username) {
        User user = userRepository.findUserByUsername(username);
        if (user==null) {
            throw new RuntimeException("User not found");
        }
        return user;
    }
    
    public User save(User user) {
        return userRepository.save(user);
    }
}
