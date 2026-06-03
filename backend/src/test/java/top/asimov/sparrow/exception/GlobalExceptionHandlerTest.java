package top.asimov.sparrow.exception;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import top.asimov.sparrow.common.ApiResponse;

class GlobalExceptionHandlerTest {

  private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

  @Test
  void businessExceptionPreservesEnvelopeShape() {
    BusinessException exception = BusinessException.notFound(
        "Project not found", ErrorCode.PROJECT_NOT_FOUND);

    ResponseEntity<ApiResponse<Void>> response = handler.handleBusinessException(exception);

    assertEquals(404, response.getStatusCode().value());
    assertEquals(404, response.getBody().code());
    assertEquals("Project not found", response.getBody().message());
    assertEquals(ErrorCode.PROJECT_NOT_FOUND, response.getBody().errorCode());
  }
}
