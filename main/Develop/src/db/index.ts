
import inquirer from 'inquirer';
import { pool } from './connection.js';
import { QueryResult } from 'pg';


// Query all departments from the Department table
export const viewAllDepartments = async (): Promise<void> => {
  try {
    const result: QueryResult = await pool.query('SELECT * FROM department');
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
        JOIN department ON role.department_id = department.id`);
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
        SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, 
               CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON employee.manager_id = manager.id`);
    const rows = result.rows;

    const col1Width = Math.max(...rows.map(row => row.id.toString().length), 4); 
    const col2Width = Math.max(...rows.map(row => row.first_name.length), 15);   
    const col3Width = Math.max(...rows.map(row => row.last_name.length), 15);    
    const col4Width = Math.max(...rows.map(row => row.title.length), 15);  
    const col5Width = Math.max(...rows.map(row => row.department.length), 15);  
    const col6Width = Math.max(...rows.map(row => row.salary.toString().length), 15);  
    const col7Width = Math.max(...rows.map(row => row.manager ? row.manager.length : null), 15);

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
        `${row.manager}${' '.repeat(col7Width - row.manager ? row.manager.length : null)}`
      );
    });


  } catch (err) {
    console.error('Error fetching employees:', err);
  }
};
  

//Add a Department
export const addDepartment = async (): Promise<void> => {
  const {name} = await inquirer.prompt({
    type: 'input',
    name: 'name',
    message: 'Please enter department name',
    });

    if (!name.trim()) {
      console.log('Department name should not be empty. Please enter a valid department name');
      return;  
    }

  try {
    const result: QueryResult = await pool.query('INSERT INTO department (name) VALUES ($1)',[name]);
    console.log(`Department "${name}" added successfully!`),result;
  } catch (err) {
    console.error(`Error adding Department "${name}"`,err);
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
    console.log(`Role "${title}" added successfully!`),result;
  } catch (err) {
    console.error(`Error adding Role "${title}"`,err);
  }
};

