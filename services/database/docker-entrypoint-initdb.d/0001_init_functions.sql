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

-- Registration
CREATE FUNCTION public.register(p_email VARCHAR, p_password VARCHAR, p_name VARCHAR, p_country INTEGER)
RETURNS json AS $$
DECLARE v_userid INT;
BEGIN
  IF EXISTS(SELECT 0 FROM public.users WHERE user_email=p_email) THEN
    RAISE EXCEPTION 'User already exists with this email' USING ERRCODE = 'TP400';
  END IF;

  INSERT INTO public.users (user_email, user_name, user_password)
  VALUES (p_email, p_name, crypt(p_password, gen_salt('bf', 8)))
  RETURNING user_id INTO v_userid;

  RETURN (SELECT public.get_user(v_userid));
END;
$$ LANGUAGE plpgsql;

-- Get user by id
CREATE FUNCTION public.get_user(p_userid INT)
RETURNS json AS $$
(SELECT to_json(z) FROM (
  SELECT
    user_id,
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
  WHERE user_id=p_userid
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
