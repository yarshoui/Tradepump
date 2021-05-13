----
-- Initialize basic access control entities
----
INSERT INTO access.operations(operation_id, operation_name) VALUES
(1, 'get.user.profile')
,(2, 'post.user.profile')
,(3, 'put.user.profile')
,(4, 'delete.user.profile')
;

INSERT INTO access.groups(group_id, group_name) VALUES
(1, 'Administrators')
;

INSERT INTO access.groups_operations(group_id, operation_id)
FROM (SELECT 1, operation_id FROM access.operations)
;
