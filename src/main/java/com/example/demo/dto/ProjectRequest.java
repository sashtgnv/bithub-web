package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProjectRequest {
    @NotBlank(message = "Name is required")
    @Size(min = 1, max = 100, message = "Name must be 1-100 characters")
    private String name;

    @Size(max = 500, message = "Description too long")
    private String description;

    private Boolean isPublic = true;
}