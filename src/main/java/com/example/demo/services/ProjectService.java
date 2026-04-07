package com.example.demo.services;

import com.example.demo.dto.ProjectRequest;
import com.example.demo.models.Project;
import com.example.demo.models.User;
import com.example.demo.repositories.ProjectRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;

@Service
@AllArgsConstructor
public class ProjectService {

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

    public Project getProject(Long id, User requester) {
        Project project = projectRepository.findProjectById(id);
        if (project==null) {
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
