package com.example.demo.controllers;

import com.example.demo.models.Project;
import com.example.demo.models.User;
import com.example.demo.services.ProjectService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping("/api/projects")
    public boolean createNewProject(@RequestBody Project project) {
        return projectService.createProject(project);
    }

    @GetMapping("/api/projects")
    public List<Project> getProjectsByOwner(@ModelAttribute User owner) {
        return projectService.findProjectsByOwner(owner);
    }

    @GetMapping("/api/projects/{id}")
    public Project getProjectById(@PathVariable Long id) {
        return projectService.findProjectById(id);
    }
}
