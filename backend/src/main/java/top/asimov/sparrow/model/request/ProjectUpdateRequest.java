package top.asimov.sparrow.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ProjectUpdateRequest(
    @NotBlank(message = "Project name is required")
    @Size(max = 120, message = "Project name must be 120 characters or less")
    String name,

    @NotBlank(message = "Project owner is required")
    @Size(max = 120, message = "Project owner must be 120 characters or less")
    String owner,

    @Pattern(regexp = "planning|active|paused", message = "Project status is invalid")
    String status) {
}
