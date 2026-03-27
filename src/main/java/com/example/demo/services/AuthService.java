package com.example.demo.services;

import com.example.demo.dto.AuthRequest;
import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository;
import com.example.demo.utils.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    /*public boolean createUser(User user) {
        if (repository.findUserByUsername(user.getUsername())==null
                && repository.findUserByEmail(user.getEmail())==null) {
            user.setPasswordHash(encoder.encode(user.getPasswordHash()));

            repository.save(user);
            return true;
        } else
            return false;
    }*/

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(encoder.encode(request.getPassword()));
        user.setIsEnabled(true);

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername(), user.getId());
        return new AuthResponse(user.getId(), user.getUsername(), token);
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findUserByUsername(request.getUsername());

        if (user==null) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.getIsEnabled()) {
            throw new RuntimeException("Account is disabled");
        }

        if (!encoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getId());
        return new AuthResponse(user.getId(), user.getUsername(), token);
    }
}
