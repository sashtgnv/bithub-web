package com.example.demo.utils;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@AllArgsConstructor
@Component
public class ProjectSaver {

    private String uploadDir;

    public String save(Long ownerId,String name, InputStream inputStream) throws IOException {
        String projectUUID = UUID.randomUUID().toString();
        Path pathToProjDir = Paths.get(uploadDir + '/' + ownerId + '/' + projectUUID);

        if (!Files.exists(pathToProjDir)) {
            Files.createDirectories(pathToProjDir);
        }

        Path pathToFile = pathToProjDir.resolve(name);
        Files.copy(inputStream, pathToFile, StandardCopyOption.REPLACE_EXISTING);

        return pathToFile.toString();
    }
}
