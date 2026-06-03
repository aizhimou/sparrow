package top.asimov.sparrow.controller;

import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import top.asimov.sparrow.common.ApiResponse;
import top.asimov.sparrow.common.CurrentUser;
import top.asimov.sparrow.model.request.ProjectCreateRequest;
import top.asimov.sparrow.model.request.ProjectUpdateRequest;
import top.asimov.sparrow.model.response.ProjectResponse;
import top.asimov.sparrow.service.ProjectService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects")
public class ProjectController {

  private final ProjectService projectService;
  private final CurrentUser currentUser;

  @GetMapping
  public ApiResponse<List<ProjectResponse>> listProjects() {
    return ApiResponse.ok(projectService.listProjects(currentUser.id()));
  }

  @PostMapping
  public ApiResponse<ProjectResponse> createProject(
      @Valid @RequestBody ProjectCreateRequest request) {
    return ApiResponse.ok(projectService.createProject(currentUser.id(), request));
  }

  @GetMapping("/{id}")
  public ApiResponse<ProjectResponse> getProject(@PathVariable long id) {
    return ApiResponse.ok(projectService.getProject(currentUser.id(), id));
  }

  @PutMapping("/{id}")
  public ApiResponse<ProjectResponse> updateProject(
      @PathVariable long id,
      @Valid @RequestBody ProjectUpdateRequest request) {
    return ApiResponse.ok(projectService.updateProject(currentUser.id(), id, request));
  }

  @DeleteMapping("/{id}")
  public ApiResponse<Void> deleteProject(@PathVariable long id) {
    projectService.deleteProject(currentUser.id(), id);
    return ApiResponse.ok();
  }
}
