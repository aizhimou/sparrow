package top.asimov.sparrow.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import top.asimov.sparrow.exception.BusinessException;
import top.asimov.sparrow.exception.ErrorCode;
import top.asimov.sparrow.mapper.ProjectMapper;

class ProjectServiceTest {

  @Test
  void getProjectRejectsMissingOrUnownedProject() {
    ProjectMapper projectMapper = mock(ProjectMapper.class);
    when(projectMapper.selectOwnedById(anyLong(), anyLong())).thenReturn(null);
    ProjectService projectService = new ProjectService(projectMapper);

    BusinessException exception = assertThrows(BusinessException.class,
        () -> projectService.getProject(1L, 2L));

    assertEquals(404, exception.getCode());
    assertEquals(ErrorCode.PROJECT_NOT_FOUND, exception.getErrorCode());
  }
}
