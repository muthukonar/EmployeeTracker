// import inquirer from 'inquirer';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './db/connection.js'

await connectToDb();


  // Query database
pool.query('SELECT * FROM employee', (err: Error, result: QueryResult) => {
    if (err) {
      console.log(err);
    } else if (result) {
      console.log(result.rows);
    }
  });