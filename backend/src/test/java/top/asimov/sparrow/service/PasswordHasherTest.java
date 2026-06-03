package top.asimov.sparrow.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class PasswordHasherTest {

  private final PasswordHasher passwordHasher = new PasswordHasher();

  @Test
  void matchesSeededDemoPasswordHash() {
    String hash = "pbkdf2$120000$1f7idR70qSJ58vfs2LT6mA==$z6eRieWSjMmiF8dOAuKbodP69V4f6uDFmJpKkNNHmZg=";

    assertTrue(passwordHasher.matches("password", hash));
    assertFalse(passwordHasher.matches("wrong-password", hash));
  }
}
