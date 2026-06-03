package top.asimov.sparrow.model.response;

public record LoginResponse(
    String token,
    UserResponse user) {
}
