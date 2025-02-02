
import { pool } from './connection.js';
import { QueryResult } from 'pg';


// Query all departments from the Department table
export const viewAllDepartments = async (): Promise<void> => {
  try {
    const result: QueryResult = await pool.query('SELECT * FROM department');
    console.log(result.rows);
  } catch (err) {
    console.error('Error fetching departments:', err);
  }
};
