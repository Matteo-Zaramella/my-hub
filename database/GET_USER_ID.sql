-- GET USER ID
-- Trova il tuo user ID

SELECT
  id,
  email,
  created_at
FROM auth.users
WHERE email = 'matteo.zaramella2002@gmail.com';
