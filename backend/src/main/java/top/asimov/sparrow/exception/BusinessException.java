package top.asimov.sparrow.exception;

import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {

  private final int code;
  private final String errorCode;

  public BusinessException(int code, String message, String errorCode) {
    super(message);
    this.code = code;
    this.errorCode = errorCode;
  }

  public static BusinessException badRequest(String message, String errorCode) {
    return new BusinessException(400, message, errorCode);
  }

  public static BusinessException unauthorized(String message, String errorCode) {
    return new BusinessException(401, message, errorCode);
  }

  public static BusinessException notFound(String message, String errorCode) {
    return new BusinessException(404, message, errorCode);
  }
}
