package top.asimov.sparrow.exception;

import cn.dev33.satoken.exception.NotLoginException;
import jakarta.servlet.http.HttpServletRequest;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import top.asimov.sparrow.common.ApiResponse;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(BusinessException.class)
  public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException e) {
    log.info("[api] business error: code={} errorCode={} reason={}",
        e.getCode(), e.getErrorCode(), e.getMessage());
    return ResponseEntity
        .status(httpStatus(e.getCode()))
        .body(ApiResponse.error(e.getCode(), e.getMessage(), e.getErrorCode()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiResponse<Void>> handleMethodArgumentNotValidException(
      MethodArgumentNotValidException e) {
    String message = validationMessage(e.getBindingResult().getFieldErrors());
    log.info("[api] request validation failed: reason={}", message);
    return ResponseEntity
        .badRequest()
        .body(ApiResponse.error(400, message));
  }

  @ExceptionHandler(BindException.class)
  public ResponseEntity<ApiResponse<Void>> handleBindException(BindException e) {
    String message = validationMessage(e.getBindingResult().getFieldErrors());
    log.info("[api] request binding failed: reason={}", message);
    return ResponseEntity
        .badRequest()
        .body(ApiResponse.error(400, message));
  }

  @ExceptionHandler(NotLoginException.class)
  public ResponseEntity<ApiResponse<Void>> handleNotLoginException(NotLoginException e,
      HttpServletRequest request) {
    log.info("[auth] unauthorized request: method={} path={} reason={}",
        request.getMethod(), request.getRequestURI(), sanitizeNotLoginMessage(e.getMessage()));
    return ResponseEntity
        .status(HttpStatus.UNAUTHORIZED)
        .body(ApiResponse.error(401, "Login required"));
  }

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<ApiResponse<Void>> handleRuntimeException(RuntimeException e,
      HttpServletRequest request) {
    log.error("[api] request failed: method={} path={} query={} exception={} reason={}",
        request.getMethod(),
        request.getRequestURI(),
        sanitizeQueryString(request.getQueryString()),
        e.getClass().getSimpleName(),
        e.getMessage(),
        e);
    return ResponseEntity
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(ApiResponse.error(500, "Internal server error"));
  }

  private String validationMessage(Iterable<FieldError> fieldErrors) {
    java.util.List<String> messages = new java.util.ArrayList<>();
    for (FieldError fieldError : fieldErrors) {
      if (StringUtils.hasText(fieldError.getDefaultMessage())) {
        messages.add(fieldError.getDefaultMessage());
      }
    }
    return String.join(", ", messages);
  }

  private HttpStatus httpStatus(int code) {
    return HttpStatus.resolve(code) == null ? HttpStatus.BAD_REQUEST : HttpStatus.valueOf(code);
  }

  private String sanitizeNotLoginMessage(String message) {
    if (!StringUtils.hasText(message)) {
      return "not logged in";
    }
    int separatorIndex = Math.max(message.lastIndexOf(':'), message.lastIndexOf('：'));
    if (separatorIndex < 0 || !message.toLowerCase().contains("token")) {
      return message;
    }
    return message.substring(0, separatorIndex + 1) + " [REDACTED]";
  }

  private String sanitizeQueryString(String queryString) {
    if (!StringUtils.hasText(queryString)) {
      return "-";
    }
    return java.util.Arrays.stream(queryString.split("&"))
        .map(this::sanitizeQueryPart)
        .collect(Collectors.joining("&"));
  }

  private String sanitizeQueryPart(String part) {
    int separatorIndex = part.indexOf('=');
    String key = separatorIndex >= 0 ? part.substring(0, separatorIndex) : part;
    if (isSensitiveQueryKey(key)) {
      return key + "=[REDACTED]";
    }
    return part;
  }

  private boolean isSensitiveQueryKey(String key) {
    return "token".equalsIgnoreCase(key)
        || "apikey".equalsIgnoreCase(key)
        || "apiKey".equals(key)
        || "access_token".equalsIgnoreCase(key)
        || "password".equalsIgnoreCase(key)
        || "code".equalsIgnoreCase(key);
  }
}
