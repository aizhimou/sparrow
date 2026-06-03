package top.asimov.sparrow.model.response;

public record ProjectResponse(
    String id,
    String name,
    String owner,
    String status,
    String updatedAt) {
}
