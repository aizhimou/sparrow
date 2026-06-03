INSERT INTO app_user (
  id,
  email,
  display_name,
  password_hash,
  status,
  created_at,
  updated_at
) VALUES (
  1800000000000000001,
  'demo@example.com',
  'Demo User',
  'pbkdf2$120000$1f7idR70qSJ58vfs2LT6mA==$z6eRieWSjMmiF8dOAuKbodP69V4f6uDFmJpKkNNHmZg=',
  'ACTIVE',
  TIMESTAMP '2026-06-01 00:00:00',
  TIMESTAMP '2026-06-01 00:00:00'
);

INSERT INTO project (
  id,
  user_id,
  name,
  owner,
  status,
  created_at,
  updated_at
) VALUES
(
  1800000000000001001,
  1800000000000000001,
  'Customer Portal',
  'Aroha Smith',
  'active',
  TIMESTAMP '2026-06-02 08:20:00',
  TIMESTAMP '2026-06-02 08:20:00'
),
(
  1800000000000001002,
  1800000000000000001,
  'Billing API Migration',
  'James Wilson',
  'planning',
  TIMESTAMP '2026-06-01 21:10:00',
  TIMESTAMP '2026-06-01 21:10:00'
);
