package com.example.demo.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CommitRequest{
//    @NotBlank(message = "File is required")
    private MultipartFile file;
    private String message;
    private String commitHash;
    private String parent;
}
