SELECT employee.id,
       employee.first_name,
       employee.last_name,
       role.title,
       department.name AS department,
       role.salary,
       CASE
           WHEN manager.first_name IS NULL AND manager.last_name IS NULL THEN 'null'
           ELSE CONCAT(manager.first_name, ' ', manager.last_name)
       END AS manager
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id
LEFT JOIN employee manager ON employee.manager_id = manager.id
ORDER BY employee.id;


