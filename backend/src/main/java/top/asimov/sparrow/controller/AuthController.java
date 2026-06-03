package top.asimov.sparrow.controller;

import cn.dev33.satoken.stp.StpUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import top.asimov.sparrow.common.ApiResponse;
import top.asimov.sparrow.common.CurrentUser;
import top.asimov.sparrow.model.request.LoginRequest;
import top.asimov.sparrow.model.response.LoginResponse;
import top.asimov.sparrow.model.response.UserResponse;
import top.asimov.sparrow.service.AuthService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;
  private final CurrentUser currentUser;

  @PostMapping("/login")
  public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
    return ApiResponse.ok(authService.login(request.email(), request.password()));
  }

  @PostMapping("/logout")
  public ApiResponse<Void> logout() {
    StpUtil.logout();
    return ApiResponse.ok();
  }

  @GetMapping("/me")
  public ApiResponse<UserResponse> me() {
    return ApiResponse.ok(authService.currentUser(currentUser.id()));
  }
}
