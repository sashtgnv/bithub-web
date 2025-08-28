package com.example.demo.utils;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@AllArgsConstructor
@Component
public class ProjectSaver {

    private String uploadDir;

    public String save(Long ownerId, String name, InputStream inputStream) throws IOException {
        Path pathToUserDir = Paths.get(uploadDir + '/' + ownerId);
        if (!Files.exists(pathToUserDir)) {
            Files.createDirectory(pathToUserDir);
        }
        Path pathToFile = Paths.get(uploadDir + '/' + ownerId + '/' + name);
        Files.copy(inputStream, pathToFile, StandardCopyOption.REPLACE_EXISTING);

        return uploadDir + '/' + ownerId + '/' + name;
    }
}
