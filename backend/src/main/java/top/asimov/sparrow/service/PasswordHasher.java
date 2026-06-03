package top.asimov.sparrow.service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.Base64;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import org.springframework.stereotype.Component;

@Component
public class PasswordHasher {

  private static final String PREFIX = "pbkdf2";
  private static final int DEFAULT_ITERATIONS = 120_000;
  private static final int KEY_LENGTH_BITS = 256;
  private static final SecureRandom SECURE_RANDOM = new SecureRandom();

  public String hash(String password) {
    byte[] salt = new byte[16];
    SECURE_RANDOM.nextBytes(salt);
    byte[] hash = pbkdf2(password, salt, DEFAULT_ITERATIONS);
    return PREFIX + "$" + DEFAULT_ITERATIONS + "$"
        + Base64.getEncoder().encodeToString(salt) + "$"
        + Base64.getEncoder().encodeToString(hash);
  }

  public boolean matches(String password, String storedHash) {
    if (password == null || storedHash == null) {
      return false;
    }

    String[] parts = storedHash.split("\\$");
    if (parts.length != 4 || !PREFIX.equals(parts[0])) {
      return false;
    }

    int iterations;
    try {
      iterations = Integer.parseInt(parts[1]);
    } catch (NumberFormatException e) {
      return false;
    }

    byte[] salt = Base64.getDecoder().decode(parts[2]);
    byte[] expected = Base64.getDecoder().decode(parts[3]);
    byte[] actual = pbkdf2(password, salt, iterations);
    return MessageDigest.isEqual(expected, actual);
  }

  private byte[] pbkdf2(String password, byte[] salt, int iterations) {
    try {
      PBEKeySpec spec = new PBEKeySpec(
          password.toCharArray(), salt, iterations, KEY_LENGTH_BITS);
      SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
      return factory.generateSecret(spec).getEncoded();
    } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
      throw new IllegalStateException("PBKDF2 password hashing is unavailable", e);
    }
  }
}
