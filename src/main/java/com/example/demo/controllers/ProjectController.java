package com.example.demo.controllers;

import com.example.demo.models.Project;
import com.example.demo.models.ProjectDTO;
import com.example.demo.models.User;
import com.example.demo.repositories.ProjectRepository;
import com.example.demo.services.ProjectService;
import com.example.demo.utils.ProjectSaver;
import lombok.AllArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@AllArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final ProjectSaver saver;
    private final String uploadDir;
    private final ProjectRepository projectRepository;

    @PostMapping(value = "/api/projects", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createNewProject(@ModelAttribute ProjectDTO projectRequest) {
        MultipartFile sourceFile = projectRequest.getFile();
        String fileName = sourceFile.getOriginalFilename();

        Project projectData = new Project(
                projectRequest.getName(),
                projectRequest.getDescription(),
                projectRequest.getIsPublic(),
                new User(projectRequest.getOwnerUserId())
        );
        if (!sourceFile.isEmpty()) {
            try {
                String filePath = saver.saveNew(projectRequest.getOwnerUserId(), fileName, sourceFile.getInputStream());
                projectData.setPath(filePath);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.internalServerError().build();
            }
        }
        return projectService.createProject(projectData) ?
                ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    @PatchMapping(value = "/api/projects")
    public ResponseEntity<?> updateProject(@ModelAttribute ProjectDTO projectRequest) {
        MultipartFile sourceFile = projectRequest.getFile();

        try {
            Project project = projectService.findProjectByOwnerUserAndName(new User(projectRequest.getOwnerUserId()), projectRequest.getName());
            String newPath = saver.update(project.getPath(), sourceFile.getInputStream(), sourceFile.getOriginalFilename());
            project.setPath(newPath);
            projectService.update(project);
            return ResponseEntity.ok().build();
        } catch (IOException e) {
//            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        } catch (NullPointerException e) {
//            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }

    }

    @GetMapping("/api/projects")
    public ResponseEntity<?> getProjectsByOwner(@ModelAttribute User owner) {
        List<Project> project = projectService.findProjectsByOwner(owner);
        return project != null ?
                ResponseEntity.ok().body(project) : ResponseEntity.notFound().build();
    }

    @GetMapping("/api/projects/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable Long id) {
        Project project = projectService.findProjectById(id);
        return project != null ?
                ResponseEntity.ok().body(project) : ResponseEntity.notFound().build();
    }

    @GetMapping(value = "/api/projects/download")
    public ResponseEntity<FileSystemResource> getProjectFileById(@RequestParam Long id) {
        Project projectData = projectService.findProjectById(id);
        if (projectData.getPath()==null) return ResponseEntity.notFound().build();
        FileSystemResource file = new FileSystemResource(projectData.getPath());
        ContentDisposition contentDisposition = ContentDisposition.attachment().filename(file.getFilename(), StandardCharsets.UTF_8).build();
        return file.exists() ?
                ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
                        .body(new FileSystemResource(file.getPath())) : ResponseEntity.notFound().build();
    }
}
