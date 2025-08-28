package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Data
@RequiredArgsConstructor
@Entity
@Table(name = "projects")
public class Project {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;
    private String name;
    private String description;
    private Boolean isPublic;
    private LocalDateTime createdAt;
    @ManyToOne
    @JoinColumn(name = "owner_user_id")
    private User ownerUser;
    private String path;

    public Project(String name, String description, Boolean isPublic, User ownerUser) {
        this.name = name;
        this.description = description;
        this.isPublic = isPublic;
        this.ownerUser = ownerUser;
    }
}
