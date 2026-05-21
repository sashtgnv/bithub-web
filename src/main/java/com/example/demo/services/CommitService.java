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

    private final ProjectService projectService;
    private final CommitRepository commitRepository;

    public Commit saveCommit(Project project, String commitHash, String message,
                             MultipartFile file) throws IOException {

        // Создаем запись в БД
        projectService.saveFiles(project,file);
        Commit commit = new Commit();
        commit.setHash(commitHash);
        commit.setMessage(message);
        commit.setProject(project);

        project.setFileSize(file.getSize());
        projectService.updateProject(project);

        return commitRepository.save(commit);
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
