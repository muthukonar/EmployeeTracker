
import inquirer from 'inquirer';
import { pool } from './connection.js';
import { QueryResult } from 'pg';


// Query all departments from the Department table
export const viewAllDepartments = async (): Promise<void> => {
  try {
    const result: QueryResult = await pool.query('SELECT * FROM department');
    const rows = result.rows;
    const col1Width = Math.max(...rows.map(row => row.id.toString().length), 4);
    const col2Width = Math.max(...rows.map(row => row.name.length), 10);

    const namePaddingLeft = Math.floor((col2Width - 4) / 2);
    const namePaddingRight = col2Width - 4 - namePaddingLeft;
    console.log(` id${' '.repeat(col1Width - 2)}${' '.repeat(namePaddingLeft)}name${' '.repeat(namePaddingRight)}`);

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
    const result: QueryResult = await pool.query('SELECT * FROM role');
    console.table(result.rows);
  } catch (err) {
    console.error('Error fetching roles:', err);
  }
};

// Query all employee from the Employee table
export const viewAllEmployees = async (): Promise<void> => {
  try {
    const result: QueryResult = await pool.query('SELECT * FROM employee');
    console.table(result.rows);
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

