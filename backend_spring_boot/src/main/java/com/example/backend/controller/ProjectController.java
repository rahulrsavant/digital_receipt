package com.example.backend.controller;

import com.example.backend.dto.ProjectRequest;
import com.example.backend.dto.ProjectResponse;
import com.example.backend.service.ProjectService;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public List<ProjectResponse> listProjects() {
        return projectService.listProjects();
    }

    @GetMapping("/{id}")
    public ProjectResponse getProject(@PathVariable Long id) {
        return projectService.getProject(id);
    }

    @PostMapping
    public ProjectResponse createProject(@RequestBody ProjectRequest request) {
        return projectService.createProject(request);
    }

    @PutMapping("/{id}")
    public ProjectResponse updateProject(@PathVariable Long id, @RequestBody ProjectRequest request) {
        return projectService.updateProject(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
    }

    @PostMapping(value = "/{id}/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProjectResponse uploadLogo(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        return projectService.uploadLogo(id, file);
    }
}
