package com.example.demo.services;

import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder encoder;

    public boolean createUser(User user) {
        if (repository.findUserByUsername(user.getUsername())==null
                && repository.findUserByEmail(user.getEmail())==null) {
            user.setPasswordHash(encoder.encode(user.getPasswordHash()));

            repository.save(user);
            return true;
        } else
            return false;
    }
}
