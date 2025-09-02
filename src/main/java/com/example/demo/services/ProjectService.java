package com.example.demo.services;

import com.example.demo.models.Project;
import com.example.demo.models.User;
import com.example.demo.repositories.ProjectRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class ProjectService {

    private final ProjectRepository repository;

    public boolean createProject(Project project) {
        if (repository.findProjectByOwnerUserAndName(project.getOwnerUser(),project.getName())!=null) {
            project.setCreatedAt(LocalDateTime.now());
            repository.save(project);
            return true;
        } else return false;
    }

    public List<Project> findProjectsByOwner(User owner) {
        return repository.findProjectByOwnerUser(owner);
    }

    public Project findProjectById(Long id) {
        return repository.findProjectById(id);
    }

    public Project findProjectByOwnerUserAndName(User ownerUser, String name) {
        return repository.findProjectByOwnerUserAndName(ownerUser,name);
    }

    public boolean update(Project project) {
        repository.save(project);
        return true;
    }
}
