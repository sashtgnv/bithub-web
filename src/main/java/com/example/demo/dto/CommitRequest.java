package com.example.demo.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CommitRequest{
    private MultipartFile file;
    private String message;
    private String commitHash;
}
