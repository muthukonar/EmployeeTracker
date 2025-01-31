DO $$


DECLARE
    var_dept_id 	INTEGER;
    var_role_id 	INTEGER;
    var_emp_id 	INTEGER;
BEGIN
    INSERT INTO department (name) 
    VALUES ('Information Technology'),
           ('Accounts and Finance'),
           ('Marketing'),
           ('Sales')
    RETURNING id INTO var_dept_id;

    INSERT INTO role (title, salary, department_id)
    VALUES 
           ('Director', 255000.00, var_dept_id),
           ('Senior Manager', 150000.00, var_dept_id),
           ('Manager', 120000.00, var_dept_id),
           ('Analyst', 100000.00, var_dept_id)
    RETURNING id INTO var_role_id;
    
    INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES 
           ('Muthu', 'Konar', var_role_id, NULL),
           ('Peter', 'Sam', var_role_id, NULL),
           ('Jon', 'Doe', var_role_id, NULL),
           ('Sarah', 'Amir', var_role_id, NULL)
    RETURNING id INTO var_emp_id;
   
    COMMIT;

EXCEPTION WHEN OTHERS THEN
    ROLLBACK;
    RAISE NOTICE 'Error in inserts: %, %', SQLSTATE, SQLERRM;
END $$;
