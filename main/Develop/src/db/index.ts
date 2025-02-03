
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
    const rows = result.rows;
    const col1Width = Math.max(...rows.map(row => row.id.toString().length), 4);
    const col2Width = Math.max(...rows.map(row => row.title.length), 10);
    const col3Width = Math.max(...rows.map(row => row.salary.toString().length), 10);
    const col4Width = Math.max(...rows.map(row => row.department_id.toString().length), 4);


    const namePaddingLeft = Math.floor((col2Width - 4) / 2);
    const namePaddingRight = col2Width - 4 - namePaddingLeft;
    console.log(` id${' '.repeat(col1Width - 2)}${' '.repeat(namePaddingLeft)}title${' '.repeat(namePaddingRight)}`);
    console.log(` id${' '.repeat(col1Width - 2)} title${' '.repeat(col2Width - 5)} salary${' '.repeat(col3Width - 6)} department_id`);
    console.log(`---- ${'-'.repeat(col2Width)} ${'-'.repeat(col3Width)} ${'-'.repeat(col4Width)}`);

    rows.forEach(row => {
      console.log(` ${row.id}${' '.repeat(col1Width - row.id.toString().length)} ${row.title}${' '.repeat(col2Width - row.title.length)} ${row.salary}${' '.repeat(col3Width - row.salary.toString().length)} ${row.department_id}${' '.repeat(col4Width - row.department_id.toString().length)}`);
    });

  } catch (err) {
    console.error('Error fetching roles:', err);
  }
};


// Query all employees from the Employee table

export const viewAllEmployees = async (): Promise<void> => {
  try {
    const result: QueryResult = await pool.query('SELECT * FROM employee');
    const rows = result.rows;

    const col1Width = Math.max(...rows.map(row => row.id.toString().length), 4); 
    const col2Width = Math.max(...rows.map(row => row.first_name.length), 10);   
    const col3Width = Math.max(...rows.map(row => row.last_name.length), 10);    
    const col4Width = Math.max(...rows.map(row => row.role_id.toString().length), 4);  
    const col5Width = Math.max(...rows.map(row => row.manager_id ? row.manager_id.toString().length : 0), 4);

    const namePaddingLeft = Math.floor((col2Width - 'first_name'.length) / 2);
    const namePaddingRight = col2Width - 'first_name'.length - namePaddingLeft;

    console.log(` id${' '.repeat(col1Width - 2)}${' '.repeat(namePaddingLeft)}first_name${' '.repeat(namePaddingRight)}last_name${' '.repeat(col3Width - 6)}role_id${' '.repeat(col4Width - 2)}manager_id`);
    
    console.log(`${'--'.repeat(col1Width - 2)} ${'-'.repeat(col2Width)} ${'-'.repeat(col3Width)} ${'--'.repeat(col4Width)} ${'---'.repeat(col5Width)}`);

    rows.forEach(row => {
      const managerId = row.manager_id ? row.manager_id.toString() : '';
      console.log(
        ` ${row.id}${' '.repeat(col1Width - row.id.toString().length)} ` +
        `${row.first_name}${' '.repeat(col2Width - row.first_name.length)} ` +
        `${row.last_name}${' '.repeat(col3Width - row.last_name.length)} ` +
        `${row.role_id}${' '.repeat(col4Width - row.role_id.toString().length)}` +
        `${managerId}${' '.repeat(col5Width - managerId.length)}`
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

