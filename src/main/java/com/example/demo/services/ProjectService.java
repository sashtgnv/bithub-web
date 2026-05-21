package com.example.demo.services;

import com.example.demo.dto.ProjectRequest;
import com.example.demo.models.Commit;
import com.example.demo.models.Project;
import com.example.demo.models.User;
import com.example.demo.repositories.ProjectRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
@AllArgsConstructor
public class ProjectService {
    @Value("${storage.path:./data/repos}")
    private String storagePath;

    private final ProjectRepository projectRepository;

    @Transactional
    public Project createProject(ProjectRequest request, User owner) {
        // Проверка: нет ли репозитория с таким именем у этого пользователя
        if (projectRepository.existsByNameAndOwner(request.getName(), owner)) {
            throw new RuntimeException("Repository with this name already exists");
        }

        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setIsPublic(request.getIsPublic());
        project.setOwner(owner);

        return projectRepository.save(project);
    }

    public Project updateProject(Project project) {
        return projectRepository.save(project);
    }

    public Project getProject(Long id, User requester) {
        Project project = projectRepository.findProjectById(id);
        if (project == null) {
            throw new RuntimeException("Repository not found");
        }

        // Если репо приватное — доступ только владельцу
        if (!project.getIsPublic() && !project.getOwner().getId().equals(requester.getId())) {
            throw new RuntimeException("Access denied");
        }
        return project;
    }

    public List<Project> getUserProjects(User owner) {
        return projectRepository.findByOwnerOrderByCreatedAtDesc(owner);
    }

    public List<Project> getPublicProjects() {
        return projectRepository.findByIsPublicTrueOrderByCreatedAtDesc();
    }

    // Получение файла коммита для скачивания
    public Path getCommitFile(Project project) {
        Path path = Paths.get(storagePath, project.getId().toString()).resolve(project.getId().toString() + ".zip");
        if (!Files.exists(path)) {
            throw new RuntimeException("Commit file not found on server");
        }
        return path;
    }

    public boolean saveFiles(Project project,
                             MultipartFile file) {
        Path repoDir = Paths.get(storagePath, project.getId().toString());
        String filename = project.getId().toString() + ".zip";
        Path filePath = repoDir.resolve(filename);

        try {
            Files.createDirectories(repoDir);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return true;
        } catch (IOException e) {
            return false;
        }
    }

//    public Project findProjectById(Long id) {
//        return projectRepository.findProjectById(id);
//    }
//
//    public Project findProjectByOwnerAndName(User ownerUser, String name) {
//        return projectRepository.findProjectByNameAndOwner(name, ownerUser);
//    }
//
//    public boolean update(Project project) {
//        projectRepository.save(project);
//        return true;
//    }
}
