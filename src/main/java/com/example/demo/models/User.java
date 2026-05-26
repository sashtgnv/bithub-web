package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String username;
    @Column(unique = true)
    private String email;
    @Column
    private String passwordHash;
    @Column
    private Boolean isEnabled;
    @Column
    private LocalDateTime createdAt;
    @Column
    private String aboutMe;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public User (Long id) {
        this.id = id;
    }
}
