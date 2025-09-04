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

    public String saveNew(Long ownerId, String name, InputStream inputStream) throws IOException {
        String projectUUID = UUID.randomUUID().toString();
        Path pathToProjDir = Paths.get(uploadDir + '/' + ownerId + '/' + projectUUID);

        if (!Files.exists(pathToProjDir)) {
            Files.createDirectories(pathToProjDir);
        }

        Path pathToFile = pathToProjDir.resolve(name);
        Files.copy(inputStream, pathToFile, StandardCopyOption.REPLACE_EXISTING);

        return pathToFile.toString();
    }

    public String update(String path, InputStream inputStream, String filename) throws IOException {
        Path pathToFile = Paths.get(path);
        if (Files.exists(pathToFile)) {
            Files.copy(inputStream, pathToFile, StandardCopyOption.REPLACE_EXISTING);
            String newPath = path.substring(0, path.lastIndexOf('/')) + '/' + filename;
            Files.move(pathToFile, Paths.get(newPath));
            return newPath;
        } else {
            System.out.println("такой файл не найден");
            throw new IOException();
        }
    }
}
