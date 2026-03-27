package com.example.demo.repositories;

import com.example.demo.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long > {
    User findUserById(Long id);

    User findUserByEmail(String email);

    User findUserByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
