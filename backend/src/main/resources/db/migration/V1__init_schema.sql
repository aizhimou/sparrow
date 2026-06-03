CREATE TABLE app_user (
  id BIGINT NOT NULL,
  email VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  status VARCHAR(32) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT uk_app_user_email UNIQUE (email)
);

CREATE TABLE project (
  id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  name VARCHAR(120) NOT NULL,
  owner VARCHAR(120) NOT NULL,
  status VARCHAR(32) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_project_user FOREIGN KEY (user_id) REFERENCES app_user(id)
);

CREATE INDEX idx_project_user_updated ON project (user_id, updated_at DESC, id DESC);
