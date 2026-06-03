package top.asimov.sparrow.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import top.asimov.sparrow.exception.BusinessException;
import top.asimov.sparrow.exception.ErrorCode;
import top.asimov.sparrow.mapper.ProjectMapper;
import top.asimov.sparrow.model.entity.Project;
import top.asimov.sparrow.model.request.ProjectCreateRequest;
import top.asimov.sparrow.model.request.ProjectUpdateRequest;
import top.asimov.sparrow.model.response.ProjectResponse;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectService {

  private static final int LIST_LIMIT = 100;
  private static final String DEFAULT_STATUS = "planning";

  private final ProjectMapper projectMapper;

  @Transactional(readOnly = true)
  public List<ProjectResponse> listProjects(long userId) {
    long startedAt = System.nanoTime();
    Page<Project> page = projectMapper.selectPageByUserId(new Page<>(1, LIST_LIMIT), userId);
    List<ProjectResponse> projects = page.getRecords().stream()
        .map(this::toResponse)
        .toList();
    log.info("[project] list completed: userId={} count={} elapsedMs={}",
        userId, projects.size(), elapsedMs(startedAt));
    return projects;
  }

  @Transactional(readOnly = true)
  public ProjectResponse getProject(long userId, long projectId) {
    return toResponse(requireOwnedProject(userId, projectId));
  }

  @Transactional
  public ProjectResponse createProject(long userId, ProjectCreateRequest request) {
    Project project = new Project();
    project.setUserId(userId);
    project.setName(request.name().trim());
    project.setOwner(request.owner().trim());
    project.setStatus(normalizeStatus(request.status()));

    projectMapper.insert(project);
    log.info("[project] created: projectId={} userId={}", project.getId(), userId);
    return toResponse(project);
  }

  @Transactional
  public ProjectResponse updateProject(long userId, long projectId, ProjectUpdateRequest request) {
    Project project = requireOwnedProject(userId, projectId);
    project.setName(request.name().trim());
    project.setOwner(request.owner().trim());
    project.setStatus(normalizeStatus(request.status()));

    projectMapper.updateById(project);
    Project updated = requireOwnedProject(userId, projectId);
    log.info("[project] updated: projectId={} userId={}", projectId, userId);
    return toResponse(updated);
  }

  @Transactional
  public void deleteProject(long userId, long projectId) {
    Project project = requireOwnedProject(userId, projectId);
    projectMapper.deleteById(project.getId());
    log.info("[project] deleted: projectId={} userId={}", projectId, userId);
  }

  private Project requireOwnedProject(long userId, long projectId) {
    Project project = projectMapper.selectOwnedById(projectId, userId);
    if (project == null) {
      throw BusinessException.notFound("Project not found", ErrorCode.PROJECT_NOT_FOUND);
    }
    return project;
  }

  private ProjectResponse toResponse(Project project) {
    return new ProjectResponse(
        String.valueOf(project.getId()),
        project.getName(),
        project.getOwner(),
        project.getStatus(),
        toIsoInstant(project.getUpdatedAt()));
  }

  private String normalizeStatus(String status) {
    return StringUtils.hasText(status) ? status : DEFAULT_STATUS;
  }

  private String toIsoInstant(LocalDateTime value) {
    return value == null ? null : value.toInstant(ZoneOffset.UTC).toString();
  }

  private long elapsedMs(long startedAt) {
    return (System.nanoTime() - startedAt) / 1_000_000;
  }
}
