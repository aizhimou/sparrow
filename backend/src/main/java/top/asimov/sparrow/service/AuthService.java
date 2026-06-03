package top.asimov.sparrow.service;

import cn.dev33.satoken.stp.StpUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import top.asimov.sparrow.exception.BusinessException;
import top.asimov.sparrow.exception.ErrorCode;
import top.asimov.sparrow.mapper.UserMapper;
import top.asimov.sparrow.model.entity.User;
import top.asimov.sparrow.model.response.LoginResponse;
import top.asimov.sparrow.model.response.UserResponse;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserMapper userMapper;
  private final PasswordHasher passwordHasher;

  @Transactional(readOnly = true)
  public LoginResponse login(String email, String password) {
    User user = userMapper.selectByEmail(email);
    if (user == null || !passwordHasher.matches(password, user.getPasswordHash())) {
      log.info("[auth] login failed: email={} reason=invalidCredentials", maskEmail(email));
      throw BusinessException.unauthorized(
          "Invalid email or password", ErrorCode.AUTH_INVALID_CREDENTIALS);
    }
    if (!user.active()) {
      log.warn("[auth] login rejected: userId={} reason=inactiveUser", user.getId());
      throw BusinessException.unauthorized("User is inactive", ErrorCode.AUTH_INACTIVE_USER);
    }

    StpUtil.login(user.getId());
    String token = StpUtil.getTokenValue();
    log.info("[auth] login succeeded: userId={} email={}", user.getId(), maskEmail(user.getEmail()));
    return new LoginResponse(token, toUserResponse(user));
  }

  @Transactional(readOnly = true)
  public UserResponse currentUser(long userId) {
    User user = userMapper.selectById(userId);
    if (user == null || !user.active()) {
      throw BusinessException.unauthorized("Login required", ErrorCode.AUTH_INACTIVE_USER);
    }
    return toUserResponse(user);
  }

  private UserResponse toUserResponse(User user) {
    return new UserResponse(String.valueOf(user.getId()), user.getEmail(), user.getDisplayName());
  }

  private String maskEmail(String email) {
    if (email == null || email.isBlank()) {
      return "-";
    }
    int atIndex = email.indexOf('@');
    if (atIndex <= 1) {
      return "***" + email.substring(Math.max(atIndex, 0));
    }
    return email.charAt(0) + "***" + email.substring(atIndex);
  }
}
