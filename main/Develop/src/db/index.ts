
import inquirer from 'inquirer';
import { pool } from './connection.js';
import { QueryResult } from 'pg';


// Query all departments from the Department table
export const viewAllDepartments = async (): Promise<void> => {
  try {
    const result: QueryResult = await pool.query('SELECT * FROM department order by id');
    const rows = result.rows;
    const col1Width = Math.max(...rows.map(row => row.id.toString().length), 4);
    const col2Width = Math.max(...rows.map(row => row.name.length), 30);

    console.log(` id${' '.repeat(col1Width - 3)} name`);

    console.log(`---- ${'-'.repeat(col2Width)} `);
    rows.forEach(row => {
      console.log(` ${row.id}${' '.repeat(col1Width - row.id.toString().length)} ${row.name}${' '.repeat(col2Width - row.name.length)}`);
    });

  } catch (err) {
    console.error('Error fetching departments:', err);
  }
};

// Query all roles from the Role table
export const viewAllRoles = async (): Promise<void> => {
  try {
    const result: QueryResult = await pool.query(`SELECT role.id, role.title, role.salary, department.name as department 
        FROM role
        JOIN department ON role.department_id = department.id order by id`);
    const rows = result.rows;
    const col1Width = Math.max(...rows.map(row => row.id.toString().length), 4);
    const col2Width = Math.max(...rows.map(row => row.title.length), 10);
    const col3Width = Math.max(...rows.map(row => row.salary.toString().length), 10);
    const col4Width = Math.max(...rows.map(row => row.department.length), 30);

    console.log(` id${' '.repeat(col1Width - 3)} title${' '.repeat(col2Width - 5)} salary${' '.repeat(col3Width - 6)} department`);
    console.log(`---- ${'-'.repeat(col2Width)} ${'-'.repeat(col3Width)} ${'-'.repeat(col4Width)}`);

    rows.forEach(row => {
      console.log(` ${row.id}${' '.repeat(col1Width - row.id.toString().length)} ${row.title}${' '.repeat(col2Width - row.title.length)} ${row.salary}${' '.repeat(col3Width - row.salary.toString().length)} ${row.department}${' '.repeat(col4Width - row.department.length)}`);
    });

  } catch (err) {
    console.error('Error fetching roles:', err);
  }
};





// Query all employees from the Employee table

export const viewAllEmployees = async (): Promise<void> => {
  try {
    const result: QueryResult = await pool.query(`
        SELECT employee.id,employee.first_name,employee.last_name,role.title,department.name AS department,role.salary,
        CASE
           WHEN manager.first_name IS NULL AND manager.last_name IS NULL THEN 'null'
           ELSE CONCAT(manager.first_name, ' ', manager.last_name)
        END AS manager
          FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON employee.manager_id = manager.id
        ORDER BY employee.id;`);
    const rows = result.rows;

    const col1Width = Math.max(...rows.map(row => row.id.toString().length), 4);
    const col2Width = Math.max(...rows.map(row => row.first_name.length), 15);
    const col3Width = Math.max(...rows.map(row => row.last_name.length), 15);
    const col4Width = Math.max(...rows.map(row => row.title.length), 15);
    const col5Width = Math.max(...rows.map(row => row.department.length), 15);
    const col6Width = Math.max(...rows.map(row => row.salary.toString().length), 15);
    const col7Width = Math.max(...rows.map(row => row.manager.length), 15);

    console.log(` id${' '.repeat(col1Width - 3)} first_name${' '.repeat(col2Width - 10)} last_name${' '.repeat(col3Width - 9)} title ${' '.repeat(col4Width - 6)} department ${' '.repeat(col5Width - 11)} salary ${' '.repeat(col6Width - 7)} manager`);
    console.log(`---- ${'-'.repeat(col2Width)} ${'-'.repeat(col3Width)} ${'-'.repeat(col4Width)} ${'-'.repeat(col5Width)} ${'-'.repeat(col6Width)} ${'-'.repeat(col7Width)}`);

    rows.forEach(row => {

      console.log(
        ` ${row.id}${' '.repeat(col1Width - row.id.toString().length)} ` +
        `${row.first_name}${' '.repeat(col2Width - row.first_name.length)} ` +
        `${row.last_name}${' '.repeat(col3Width - row.last_name.length)} ` +
        `${row.title}${' '.repeat(col4Width - row.title.length)}` +
        `${row.department}${' '.repeat(col5Width - row.department.length)}` +
        ` ${row.salary}${' '.repeat(col6Width - row.salary.toString().length)} ` +
        `${row.manager}${' '.repeat(col7Width - row.manager.length)}`
      );
    });


  } catch (err) {
    console.error('Error fetching employees:', err);
  }
};


//Add a Department
export const addDepartment = async (): Promise<void> => {
  const { name } = await inquirer.prompt({
    type: 'input',
    name: 'name',
    message: 'Please enter department name',
  });

  if (!name.trim()) {
    console.log('Department name should not be empty. Please enter a valid department name');
    return;
  }

  try {
    const result: QueryResult = await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
    console.log(`Department "${name}" added successfully!`), result;
  } catch (err) {
    console.error(`Error adding Department "${name}"`, err);
  }
};


//Add a Role
export const addRole = async (): Promise<void> => {
  const dept = await pool.query('SELECT * FROM department');
  const deptChoices = dept.rows.map(department => ({
    name: department.name,
    value: department.id
  }));

  const { title, salary, department_id } = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is the name of the role?'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary of the role?'
    },
    {
      type: 'list',
      name: 'department_id',
      message: 'Which department does the role belong to?',
      choices: deptChoices
    }
  ]);
  try {
    const result: QueryResult = await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
    console.log(`Role "${title}" added successfully!`), result;
  } catch (err) {
    console.error(`Error adding Role "${title}"`, err);
  }
};


//Add an employee

export const addEmployee = async (): Promise<void> => {
  const roles = await pool.query('SELECT * FROM role');
  const employees = await pool.query('SELECT id, first_name, last_name FROM employee');

  const roleChoices = roles.rows.map(role => ({
    name: role.title,
    value: role.id
  }));

  const managerChoices = employees.rows.map(employee => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id
  }));

  managerChoices.push({ name: 'None', value: null });

  const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'What is the employees\'s first name? '
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'What is the employees\'s last name?'
    },
    {
      type: 'list',
      name: 'role_id',
      message: 'What is the employees\'s role?',
      choices: roleChoices
    },
    {
      type: 'list',
      name: 'manager_id',
      message: 'Who is the employees\'s manager?',
      choices: managerChoices
    }
  ]);
  try {
    const result: QueryResult = await pool.query(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
    console.log(`Employee "${first_name}.${last_name}" added successfully!`), result;
  }
  catch (err) {
    console.error(`Error adding Employee "${first_name}.${last_name}"`, err);
  }
};


//update an employee role 

export const updateEmployeeRole = async (): Promise<void> => {
  const roles = await pool.query('SELECT * FROM role');
  const employees = await pool.query('SELECT id, first_name, last_name FROM employee');

  const roleChoices = roles.rows.map(role => ({
    name: role.title,
    value: role.id
  }));

  const employeeChoices = employees.rows.map(employee => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id
  }));

  const { employee_id, role_id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employee_id',
      message: 'Which employee role do you want to update?',
      choices: employeeChoices
    },
    {
      type: 'list',
      name: 'role_id',
      message: 'Which role do you want to assign to selected employee',
      choices: roleChoices
    }
  ]);

  try {
    const result: QueryResult = await pool.query(
      'UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
    console.log(`Employee's role updated successfully!`), result;
  }
  catch (err) {
    console.error(`Employee's role update failed!`, err);
  }

};


//Update an Employee Manager

export const updateEmployeeManager = async (): Promise<void> => {
  const employees = await pool.query('SELECT id, first_name, last_name FROM employee');

  const employeeChoices = employees.rows.map(employee => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id
  }));

  const { employee_id, manager_id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employee_id',
      message: 'Which employee do you want to update?',
      choices: employeeChoices
    },
    {
      type: 'list',
      name: 'manager_id',
      message: 'Select a new manager for the employee:',
      choices: employeeChoices
    }
  ]);

  try {
    const result: QueryResult =
      await pool.query('UPDATE employee SET manager_id = $1 WHERE id = $2', [manager_id, employee_id]);
    console.log(`Employee's manager updated successfully!`), result;
  }
  catch (err) {
    console.error(`Employee's manager update failed!`, err);
  }
};


//Delete Department
export const deleteDepartment = async (): Promise<void> => {
  const departments = await pool.query('SELECT id, name FROM department');

  const departmentChoices = departments.rows.map(department => ({
    name: department.name,
    value: department.id
  }));

  const { department_id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'department_id',
      message: 'Which department would you like to delete?',
      choices: departmentChoices
    }
  ]);


  try {
    const result: QueryResult =
      await pool.query('DELETE FROM department WHERE id = $1', [department_id]);
    console.log(`Department deleted successfully!`), result;
  }
  catch (err) {
    console.error(`Department delete failed!`, err);
  }
};

//Delete Role

export const deleteRole = async (): Promise<void> => {
  const roles = await pool.query('SELECT id, title FROM role');

  const roleChoices = roles.rows.map(role => ({
    name: role.title,
    value: role.id
  }));

  const { role_id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'role_id',
      message: 'Which role would you like to delete?',
      choices: roleChoices
    }
  ]);

  try {
    const result: QueryResult =
      await pool.query('DELETE FROM role WHERE id = $1', [role_id]);
    console.log(`Role deleted successfully!`), result;
  }
  catch (err) {
    console.error(`Role delete failed!`, err);
  }
};


//Delete Employee

export const deleteEmployee = async (): Promise<void> => {
  const employees = await pool.query('SELECT id, first_name, last_name FROM employee');

  const employeeChoices = employees.rows.map(employee => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id
  }));

  const { employee_id } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employee_id',
      message: 'Which employee would you like to delete?',
      choices: employeeChoices
    }
  ]);


  try {
    const result: QueryResult =
      await pool.query('DELETE FROM employee WHERE id = $1', [employee_id]);
    console.log(`Employee deleted successfully!`), result;
  }
  catch (err) {
    console.error(`Employee delete failed!`, err);
  }
};

