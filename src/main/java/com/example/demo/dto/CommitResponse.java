package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CommitResponse {
    private String hash;
    private String message;
    private String author;
    private LocalDateTime createdAt;

}
