package com.example.demo.services;

import com.example.demo.models.Commit;
import com.example.demo.models.Project;
import com.example.demo.repositories.CommitRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
@AllArgsConstructor
public class CommitService {

    @Value("${storage.path:./data/repos}")
    private String storagePath;

    private final CommitRepository commitRepository;

    public Commit saveCommit(Project repository, String commitHash, String message,
                             MultipartFile file, Commit parent) throws IOException {

        // Создаем папку: {storagePath}/{repo_id}/
        Path repoDir = Paths.get(storagePath, repository.getId().toString());
        Files.createDirectories(repoDir);

        // Уникальное имя файла: {commit_hash}.zip
        String filename = commitHash + ".zip";
        Path filePath = repoDir.resolve(filename);

        // Сохраняем файл на диск
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
//        file.transferTo(filePath);

        // Создаем запись в БД
        Commit commit = new Commit();
        commit.setHash(commitHash);
        commit.setMessage(message);
        commit.setProject(repository);
        commit.setParent(parent);
        commit.setFileSize(file.getSize());
        commit.setStoragePath(filePath.toString()); // Абсолютный путь

        return commitRepository.save(commit);
    }

    // Получение файла коммита для скачивания
    public Path getCommitFile(Commit commit) {
        Path path = Paths.get(commit.getStoragePath());
        if (!Files.exists(path)) {
            throw new RuntimeException("Commit file not found on server");
        }
        return path;
    }

    public List<Commit> getCommitHistory(Project repository) {
        return commitRepository.findByProjectOrderByCreatedAtDesc(repository);
    }

    public Commit getCommitByHash(String commitHash) {

        Commit commit = commitRepository.findByHash(commitHash);
        if (commit == null) {
            throw new RuntimeException("Commit not found");
        } else
            return commit;
    }


}
