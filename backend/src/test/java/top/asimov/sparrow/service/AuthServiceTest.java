package top.asimov.sparrow.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import top.asimov.sparrow.exception.BusinessException;
import top.asimov.sparrow.exception.ErrorCode;
import top.asimov.sparrow.mapper.UserMapper;

class AuthServiceTest {

  @Test
  void loginRejectsUnknownUser() {
    UserMapper userMapper = mock(UserMapper.class);
    when(userMapper.selectByEmail("demo@example.com")).thenReturn(null);
    AuthService authService = new AuthService(userMapper, new PasswordHasher());

    BusinessException exception = assertThrows(BusinessException.class,
        () -> authService.login("demo@example.com", "password"));

    assertEquals(401, exception.getCode());
    assertEquals(ErrorCode.AUTH_INVALID_CREDENTIALS, exception.getErrorCode());
  }
}
