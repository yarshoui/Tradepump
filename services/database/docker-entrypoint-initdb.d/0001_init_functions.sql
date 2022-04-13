------------------
-- Access control
------------------
-- Check access for operation for user
CREATE FUNCTION access.check(p_userid INT, p_opname VARCHAR)
RETURNS void AS $$
DECLARE v_opid INT;
        v_opexists BOOLEAN DEFAULT FALSE;
BEGIN
  SELECT operation_id INTO v_opid FROM access.operations WHERE operation_name = p_opname;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Operation not found' USING ERRCODE = 'TP404';
  END IF;

  v_opexists := EXISTS(
    SELECT 0 FROM access.users_operations
    WHERE user_id=p_userid AND operation_id=v_opid
  ) OR EXISTS(
    SELECT 0 FROM access.groups_operations gro
    INNER JOIN access.users_groups ug ON ug.group_id = gro.group_id
    WHERE ug.user_id=p_userid AND gro.operation_id=v_opid
  );

  IF NOT v_opexists THEN
    RAISE EXCEPTION 'Operation not permitted' USING ERRCODE = 'TP403';
  END IF;
END;
$$ LANGUAGE plpgsql;

------------------
-- User management
------------------
-- Authtorization
CREATE FUNCTION public.auth(p_login VARCHAR, p_password VARCHAR)
RETURNS json AS $$
DECLARE v_userid INT;
BEGIN
  SELECT user_id INTO v_userid FROM public.users WHERE user_email=p_login;

  IF NOT EXISTS(SELECT 0 FROM public.users WHERE user_email=p_login AND user_password = crypt(p_password, user_password)) THEN
    RAISE EXCEPTION 'Login or password are incorrect' USING ERRCODE = 'TP400';
  END IF;

  RETURN (SELECT public.get_user(v_userid));
END;
$$ LANGUAGE plpgsql;

-- Create user
CREATE FUNCTION private.create_user(p_email VARCHAR, p_password VARCHAR)
RETURNS json AS $$
DECLARE v_userid INT;
BEGIN
  IF EXISTS(SELECT 0 FROM public.users WHERE user_email=p_email) THEN
    RAISE EXCEPTION 'User already exists with this email' USING ERRCODE = 'TP400';
  END IF;

  -- Create user in db
  INSERT INTO public.users (user_email, user_password)
  VALUES (p_email, crypt(p_password, gen_salt('bf', 8)))
  RETURNING user_id INTO v_userid;
  -- Add data field
  INSERT INTO private.users_data(user_id) VALUES (v_userid);

  RETURN (SELECT public.get_user(v_userid));
END;
$$ LANGUAGE plpgsql;

-- Activate user
CREATE FUNCTION private.activate_user(p_code VARCHAR)
RETURNS json AS $$
DECLARE v_userid INT;
BEGIN
  SELECT user_id INTO v_userid
  FROM private.users_tokens WHERE token = p_code;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Incorrect code' USING ERRCODE = 'TP400';
  END IF;

  UPDATE public.users SET
    user_is_active = TRUE,
    user_activated = LOCALTIMESTAMP
  WHILE user_id = v_userid;

  RETURN (SELECT public.get_user(v_userid));
END;
$$ LANGUAGE plpgsql;

-- Update user
CREATE FUNCTION private.update_user(
  p_userid    INT,
  p_countryid INT     DEFAULT NULL,
  p_name      VARCHAR DEFAULT NULL,
  p_email     VARCHAR DEFAULT NULL,
  p_password  VARCHAR DEFAULT NULL,
  p_role      VARCHAR DEFAULT NULL
)
RETURNS json AS $$
BEGIN
  IF NOT EXISTS(SELECT 0 FROM public.users WHERE user_id=p_userid) THEN
    RAISE EXCEPTION 'User not found' USING ERRCODE = 'TP404';
  END IF;

  UPDATE public.users SET
    user_email = COALESCE(p_email::public.email, user_email),
    user_role = COALESCE(p_role::roles, user_role),
    user_password = COALESCE(crypt(p_password, gen_salt('bf', 8)), user_password)
  WHILE user_id = v_userid;

  UPDATE private.users_data SET
    user_country = COALESCE(p_countryid, user_country),
    user_name = COALESCE(p_name, user_name)
  WHILE user_id = v_userid;

  RETURN (SELECT public.get_user(p_userid));
END;
$$ LANGUAGE plpgsql;

-- Get user by id
CREATE FUNCTION private.get_user(p_userid INT)
RETURNS json AS $$
(SELECT to_json(z) FROM (
  SELECT
    u.user_id,
    user_name,
    user_email,
    user_is_active,
    user_role,
    (SELECT to_json(c) FROM public.countries c WHERE country_id=user_country) country,
    user_created,
    (SELECT array_to_json(array_agg(x.group_name)) FROM (
      SELECT
        group_name
      FROM access.users_groups ug
      INNER JOIN access.groups g ON g.group_id=ug.group_id
      WHERE ug.user_id=u.user_id) x) user_groups
  FROM public.users u
  INNER JOIN private.users_data d ON d.user_id = u.user_id
  WHERE u.user_id=p_userid
) z)
$$ LANGUAGE SQL;

-- Get Countries
CREATE FUNCTION public.get_countries()
RETURNS json AS $$
(SELECT array_to_json(array_agg(to_json(z))) FROM (
  SELECT
    *
  FROM public.countries
) z)
$$ LANGUAGE SQL;

--
-- Generate token then send token id to user
-- Once user access token = use token do the job
--
-- Generate token
CREATE FUNCTION private.generate_token(
  v_userid  INT,
  v_expires TIMESTAMP WITHOUT TIME ZONE DEFAULT (LOCALTIMESTAMP + '1 hour'::INTERVAL)
)
RETURNS VARCHAR AS $$
DECLARE v_token VARCHAR;
BEGIN
  v_token := md5(random()::text) || md5(random()::text);
  INSERT INTO private.users_tokens (user_id, token, token_expires) VALUES
    (v_userid, v_token, v_expires);

  RETURN v_token;
END;
$$ LANGUAGE plpgsql;

-- Use token
CREATE FUNCTION private.use_token(
  v_userid  INT,
  v_token VARCHAR
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE private.users_tokens SET
    token_used=LOCALTIMESTAMP
  WHERE user_id=v_userid AND token=v_token AND token_used IS NULL AND token_expires > LOCALTIMESTAMP;

  IF NOT FOUND THEN
    RETURN FALSE;
  ELSE
    RETURN TRUE;
  END IF;
END;
$$ LANGUAGE plpgsql;



-- TODO:
-- Delete user
  -- remove tokens
  -- remove user_data
  -- remove user

------------------
--
------------------