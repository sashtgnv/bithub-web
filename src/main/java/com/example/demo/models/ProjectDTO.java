package com.example.demo.models;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ProjectDTO {
    private MultipartFile file;
    private String name;
    private String description;
    private Boolean isPublic;
    private Long ownerUserId;
}
