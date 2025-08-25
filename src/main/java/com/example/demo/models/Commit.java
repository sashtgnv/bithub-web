package com.example.demo.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "commits")
public class Commit {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;
    private String hash;
    private LocalDateTime createdAt;
    private String description;
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
}
