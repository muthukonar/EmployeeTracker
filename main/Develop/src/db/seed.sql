DO $$

DECLARE
    var_dept_id 	INTEGER;
    var_role_id 	INTEGER;
    var_emp_id 	INTEGER;
BEGIN
    INSERT INTO department (name) VALUES ('Information Technology') RETURNING id INTO var_dept_id;
    INSERT INTO role (title, salary, department_id) VALUES ('Director', 255000.00, var_dept_id) RETURNING id INTO var_role_id;
    INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Muthu', 'Konar', var_role_id, NULL) RETURNING id INTO var_emp_id;

    INSERT INTO department (name) VALUES ('Accounts') RETURNING id INTO var_dept_id;
    INSERT INTO role (title, salary, department_id) VALUES ('Manager', 155000.00, var_dept_id) RETURNING id INTO var_role_id;
    INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Priya', 'M', var_role_id, NULL) RETURNING id INTO var_emp_id;
   
    INSERT INTO department (name) VALUES ('Marketing') RETURNING id INTO var_dept_id;
    INSERT INTO role (title, salary, department_id) VALUES ('Analyst', 120000.00, var_dept_id) RETURNING id INTO var_role_id;
    INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Jon', 'Doe', var_role_id, NULL) RETURNING id INTO var_emp_id;

    INSERT INTO department (name) VALUES ('Sales') RETURNING id INTO var_dept_id;
    INSERT INTO role (title, salary, department_id) VALUES ('Officer', 130000.00, var_dept_id) RETURNING id INTO var_role_id;
    INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Sarah', 'Peter', var_role_id, NULL) RETURNING id INTO var_emp_id;

EXCEPTION WHEN OTHERS THEN
    ROLLBACK;
    RAISE NOTICE 'Error in inserts: %, %', SQLSTATE, SQLERRM;
END $$;


