package com.example.demo.controllers;

import com.example.demo.dto.CommitResponse;
import com.example.demo.dto.ProjectDto;
import com.example.demo.dto.ProjectRequest;
import com.example.demo.models.Commit;
import com.example.demo.models.Project;
import com.example.demo.models.User;
import com.example.demo.services.CommitService;
import com.example.demo.services.ProjectService;
import com.example.demo.services.UserService;
import com.example.demo.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/proj")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Для разработки
public class ProjectController {

    private final ProjectService projectService;
    private final CommitService commitService;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    // Вспомогательный метод: извлечь пользователя из токена
    private User getCurrentUser(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            if (jwtUtil.validateToken(token)) {
                return userService.getUserFromToken(token);
            }
        }
        throw new RuntimeException("Unauthorized");
    }

    // POST /api/proj — создать репозиторий
    @PostMapping
    public ResponseEntity<Object> create(@Valid @RequestBody ProjectRequest request,
                                          HttpServletRequest req) {
        try {
            User owner = getCurrentUser(req);
            Project project = projectService.createProject(request, owner);
            return ResponseEntity.ok(project);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    // GET /api/proj/my— список моих репозиториев
    @GetMapping("/my")
    public ResponseEntity<List<Project>> getMyProjects(HttpServletRequest req) {
        User user = getCurrentUser(req);
        return ResponseEntity.ok(projectService.getUserProjects(user));
    }

    // GET /api/proj/public — публичные репозитории (каталог)
    @GetMapping("/public")
    public ResponseEntity<List<Project>> getPublicRepos() {
        return ResponseEntity.ok(projectService.getPublicProjects());
    }

    // GET /api/proj/{id} — информация о репозитории
    @GetMapping("/{id}")
    public ResponseEntity<Project> getRepo(@PathVariable Long id, HttpServletRequest req) {
        User user = getCurrentUser(req);
        return ResponseEntity.ok(projectService.getProject(id, user));
    }

    // POST /api/proj/{id}/push — загрузка коммита (файла)
    @PostMapping(value = "/{idProj}/push", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> push(@PathVariable Long idProj,
                                  @RequestParam("file") MultipartFile file,
                                  @RequestParam("message") String message,
                                  @RequestParam("hash") String commitHash,
                                  HttpServletRequest req) {
        try {
            System.out.println("push " + idProj + ' '+ commitHash);
            User user = getCurrentUser(req);
            Project repo = projectService.getProject(idProj, user);

            // Проверка прав
            if (!repo.getOwner().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body("Only owner can push");
            }

            // Сохранение
            Commit commit = commitService.saveCommit(repo, commitHash, message, file);

            return ResponseEntity.ok(commit);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Push failed: " + e.getMessage());
        }
    }

    // GET /api/proj/{id}/commits — история коммитов
    @GetMapping("/{id}/commits")
    public ResponseEntity<List<CommitResponse>> getCommits(@PathVariable Long id,
                                                           HttpServletRequest req) {
        User user = getCurrentUser(req);
        Project proj = projectService.getProject(id, user);

        List<Commit> commits = commitService.getCommitHistory(proj);
        List<CommitResponse> response = commits.stream()
                .map(c -> new CommitResponse(
                        c.getHash(),
                        c.getMessage(),
                        c.getProject().getOwner().getUsername(),
                        c.getCreatedAt()
//                        ,c.getFileSize()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // GET /api/proj/{id}/clone/{hash} — скачать снапшот коммита
    @GetMapping("/clone/{id}")
    public ResponseEntity<FileSystemResource> clone(@PathVariable Long id,
                                                    HttpServletRequest req) {
        User user;
        try {
            user = getCurrentUser(req);
        } catch (RuntimeException e) {
            user = new User(0L);
        }
        Project proj = projectService.getProject(id, user);

        // Проверка доступа: если репо приватное, только владелец
        if (!proj.getIsPublic() && !proj.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        Path file = projectService.getCommitFile(proj);
        FileSystemResource resource = new FileSystemResource(file);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + id + ".zip\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

   /**/
}
