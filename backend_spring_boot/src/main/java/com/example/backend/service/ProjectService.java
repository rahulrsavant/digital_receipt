package com.example.backend.service;

import com.example.backend.dto.ExtraFieldDefinition;
import com.example.backend.dto.ProjectRequest;
import com.example.backend.dto.ProjectResponse;
import com.example.backend.entity.Project;
import com.example.backend.repository.ProjectRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ObjectMapper objectMapper;
    private final String uploadDir;

    public ProjectService(ProjectRepository projectRepository, ObjectMapper objectMapper,
                          @Value("${app.upload.dir}") String uploadDir) {
        this.projectRepository = projectRepository;
        this.objectMapper = objectMapper;
        this.uploadDir = uploadDir;
    }

    public List<ProjectResponse> listProjects() {
        return projectRepository.findAll().stream().map(this::toResponse).toList();
    }

    public ProjectResponse getProject(Long id) {
        return toResponse(projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Project not found")));
    }

    public ProjectResponse createProject(ProjectRequest request) {
        if (request.getCode() == null || request.getCode().isBlank()) {
            throw new IllegalArgumentException("Project code is required");
        }
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Project name is required");
        }
        Optional<Project> existing = projectRepository.findByCode(request.getCode());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Project code already exists");
        }
        Project project = new Project();
        applyRequest(project, request);
        return toResponse(projectRepository.save(project));
    }

    public ProjectResponse updateProject(Long id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        if (request.getCode() != null && !request.getCode().equals(project.getCode())) {
            Optional<Project> existing = projectRepository.findByCode(request.getCode());
            if (existing.isPresent()) {
                throw new IllegalArgumentException("Project code already exists");
            }
        }
        applyRequest(project, request);
        return toResponse(projectRepository.save(project));
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    public ProjectResponse uploadLogo(Long id, MultipartFile file) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Logo file is required");
        }
        try {
            String originalName = file.getOriginalFilename();
            String ext = "";
            if (originalName != null && originalName.contains(".")) {
                ext = originalName.substring(originalName.lastIndexOf('.'));
            }
            String filename = UUID.randomUUID() + ext;
            Path dirPath = Paths.get(uploadDir, "logos");
            Files.createDirectories(dirPath);
            Path filePath = dirPath.resolve(filename);
            Files.write(filePath, file.getBytes());
            String publicPath = "/uploads/logos/" + filename;
            project.setLogoPath(publicPath);
            return toResponse(projectRepository.save(project));
        } catch (IOException ex) {
            throw new IllegalStateException("Unable to save logo", ex);
        }
    }

    public Project findByCode(String code) {
        return projectRepository.findByCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
    }

    private void applyRequest(Project project, ProjectRequest request) {
        if (request.getCode() != null) {
            project.setCode(request.getCode());
        }
        if (request.getName() != null) {
            project.setName(request.getName());
        }
        if (request.getLogoPath() != null) {
            project.setLogoPath(request.getLogoPath());
        }
        if (request.getPrimaryColor() != null) {
            project.setPrimaryColor(request.getPrimaryColor());
        }
        if (request.getSecondaryColor() != null) {
            project.setSecondaryColor(request.getSecondaryColor());
        }
        if (request.getAddress() != null) {
            project.setAddress(request.getAddress());
        }
        if (request.getPhone() != null) {
            project.setPhone(request.getPhone());
        }
        if (request.getEmail() != null) {
            project.setEmail(request.getEmail());
        }
        if (request.getFooterNote() != null) {
            project.setFooterNote(request.getFooterNote());
        }
        if (request.getIsActive() != null) {
            project.setIsActive(request.getIsActive());
        }
        if (request.getReceiptExtraSchema() != null) {
            project.setReceiptExtraSchema(writeSchemaJson(request.getReceiptExtraSchema()));
        }
    }

    private ProjectResponse toResponse(Project project) {
        ProjectResponse response = new ProjectResponse();
        response.setId(project.getId());
        response.setCode(project.getCode());
        response.setName(project.getName());
        response.setLogoPath(project.getLogoPath());
        response.setPrimaryColor(project.getPrimaryColor());
        response.setSecondaryColor(project.getSecondaryColor());
        response.setAddress(project.getAddress());
        response.setPhone(project.getPhone());
        response.setEmail(project.getEmail());
        response.setFooterNote(project.getFooterNote());
        response.setIsActive(project.getIsActive());
        response.setReceiptExtraSchema(readSchema(project.getReceiptExtraSchema()));
        response.setReceiptSeq(project.getReceiptSeq());
        response.setCreatedAt(project.getCreatedAt());
        response.setUpdatedAt(project.getUpdatedAt());
        return response;
    }

    private List<ExtraFieldDefinition> readSchema(String json) {
        if (json == null || json.isBlank()) {
            return List.of();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<ExtraFieldDefinition>>() {});
        } catch (IOException ex) {
            throw new IllegalStateException("Invalid schema JSON", ex);
        }
    }

    private String writeSchemaJson(List<ExtraFieldDefinition> schema) {
        try {
            return objectMapper.writeValueAsString(schema);
        } catch (IOException ex) {
            throw new IllegalStateException("Unable to serialize schema", ex);
        }
    }
}
