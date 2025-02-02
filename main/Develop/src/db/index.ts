
import inquirer from 'inquirer';
import { pool } from './connection.js';
import { QueryResult } from 'pg';


// Query all departments from the Department table
export const viewAllDepartments = async (): Promise<void> => {
  try {
    const result: QueryResult = await pool.query('SELECT * FROM department');
    console.table(result.rows);
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
  try {
    const result: QueryResult = await pool.query('INSERT INTO department (name) VALUES ($1)',[name]);
    console.log(`Department "${name}" added successfully!`),result;
  } catch (err) {
    console.error(`Error adding Department "${name}"`,err);
  }
};