package top.asimov.sparrow.common;

public record ApiResponse<T>(
    int code,
    String message,
    T data,
    String errorCode) {

  public static <T> ApiResponse<T> ok(T data) {
    return new ApiResponse<>(200, "OK", data, null);
  }

  public static ApiResponse<Void> ok() {
    return ok(null);
  }

  public static ApiResponse<Void> error(int code, String message) {
    return new ApiResponse<>(code, message, null, null);
  }

  public static ApiResponse<Void> error(int code, String message, String errorCode) {
    return new ApiResponse<>(code, message, null, errorCode);
  }
}
