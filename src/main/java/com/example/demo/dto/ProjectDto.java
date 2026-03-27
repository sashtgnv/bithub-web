package com.example.demo.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ProjectDto {
    private MultipartFile file;
    private String name;
    private String description;
    private Boolean isPublic;
    private Long ownerUserId;
}
