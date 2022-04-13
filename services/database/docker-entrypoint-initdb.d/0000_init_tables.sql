
CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;
COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
COMMENT ON EXTENSION pgcrypto IS 'provides cryptographic functions for PostgreSQL';

-- User roles
CREATE TYPE roles AS ENUM('guest', 'user', 'moderator', 'admin');

-- Email domain with constrains
CREATE DOMAIN public.email AS public.citext
	CONSTRAINT email_validate CHECK ((VALUE OPERATOR(public.~) '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'::public.citext));

-- Users table
CREATE TABLE public.users (
  user_id SERIAL NOT NULL PRIMARY KEY,
  user_email public.email NOT NULL UNIQUE,
  user_password VARCHAR(72) NOT NULL,
  user_role roles DEFAULT 'user',
  user_is_active BOOLEAN DEFAULT FALSE,
  user_activated TIMESTAMP WITHOUT TIME ZONE,
  user_created TIMESTAMP WITHOUT TIME ZONE DEFAULT LOCALTIMESTAMP NOT NULL
);
-- Regions
CREATE TABLE public.countries (
  country_id INTEGER NOT NULL PRIMARY KEY,
  country_iso CHAR(2) NOT NULL UNIQUE,
  country_name VARCHAR(80) NOT NULL,
  country_iso3 CHAR(3) DEFAULT NULL UNIQUE,
  country_numcode SMALLINT DEFAULT NULL,
  country_phonecode INTEGER NOT NULL
);

----
-- Private data
----
CREATE SCHEMA private;

-- User data
CREATE TABLE private.users_data (
  user_id INTEGER NOT NULL PRIMARY KEY,
  user_country INTEGER,
  user_name VARCHAR(255)
);

-- User tokens
CREATE TABLE private.users_tokens (
  user_id INTEGER NOT NULL,
  token VARCHAR(64) NOT NULL UNIQUE,
  token_expires TIMESTAMP WITHOUT TIME ZONE,
  token_used TIMESTAMP WITHOUT TIME ZONE,
  token_created TIMESTAMP WITHOUT TIME ZONE DEFAULT LOCALTIMESTAMP NOT NULL,

  PRIMARY KEY users_tokens_pkey (user_id, token)
);
COMMENT ON TABLE private.users_tokens IS '
  Token factory. For account activation or password restore.
  General store, just need to have a check against user_id+token
';

----
-- System level data
----
CREATE SCHEMA system;

-- TODO: functions: create_task, pull_task - update task_pulled, finish_task(delete)
CREATE TABLE system.tasks (
  task_id BIGSERIAL NOT NULL PRIMARY KEY,
  task_handler INTEGER NOT NULL,
  task_data TEXT,
  task_pulled TIMESTAMP WITHOUT TIME ZONE, -- last time task pulled by worker
  task_timeout INTERVAL DEFAULT '5 minute'::INTERVAL NOT NULL,
  task_created TIMESTAMP WITHOUT TIME ZONE DEFAULT LOCALTIMESTAMP NOT NULL
);

CREATE TABLE system.tasks_handlers (
  handler_id SERIAL NOT NULL PRIMARY KEY,
  handler_name VARCHAR(255),
  handler_description TEXT
);

----
-- Access Control
----
CREATE SCHEMA access;

CREATE TABLE access.operations (
  operation_id SERIAL NOT NULL PRIMARY KEY,
  operation_name VARCHAR NOT NULL UNIQUE
);
COMMENT ON TABLE access.operations IS '
  List of available operations to user
  Segregates access to different sections of application
';

CREATE TABLE access.groups(
  group_id SERIAL NOT NULL PRIMARY KEY,
  group_name VARCHAR NOT NULL UNIQUE
);
COMMENT ON TABLE access.groups IS '
  Groups available operations under convenient name
  Like "Moderators" have access to extended functions than "Users"
';

CREATE TABLE access.groups_operations (
  group_id INT NOT NULL,
  operation_id INT NOT NULL,
  PRIMARY KEY(group_id, operation_id)
);
COMMENT ON TABLE access.groups_operations IS '
  Dependency table, which group allows which operations
';

CREATE TABLE access.users_groups (
  user_id INT NOT NULL,
  group_id INT NOT NULL,
  PRIMARY KEY(user_id, group_id)
);
COMMENT ON TABLE access.users_groups IS '
  User can be assigned to an access group
';

CREATE TABLE access.users_operations (
  user_id INT NOT NULL,
  operation_id INT NOT NULL,
  PRIMARY KEY(user_id, operation_id)
);
COMMENT ON TABLE access.users_operations IS '
  User can also be granted spearate functionality
';

CREATE TABLE access.log (
  operation_id INT NOT NULL,
  user_id INT NOT NULL,
  log_created TIMESTAMP WITHOUT TIME ZONE DEFAULT LOCALTIMESTAMP,
  PRIMARY KEY(user_id, operation_id)
);
COMMENT ON TABLE access.log IS '
  Monitor who tried to access what and when
  Can be used to get users last login
';
