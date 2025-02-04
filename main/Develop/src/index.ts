import inquirer from 'inquirer';
import { connectToDb } from './db/connection.js';

await connectToDb();
import {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
  updateEmployeeManager,
  deleteDepartment,
  deleteRole,
  deleteEmployee,
  viewTotalBudgetByDepartment
} from './db/index.js';

const mainMenu = async () => {
  const answers = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a Department',
      'Add a Role',
      'Add an Employee',
      'Update an Employee Role',
      'Update an employee manager',
      'Delete a department',
      'Delete a role',
      'Delete an employee',
      'View total budget utilized by a department',
       'Exit'
    ]
  });

  switch (answers.action) {
    case 'View all departments':
      await viewAllDepartments();
      break;
    case 'View all roles':
      await viewAllRoles();
      break;
    case 'View all employees':
      await viewAllEmployees();
      break;
    case 'Add a Department':
      await addDepartment();
      break;
    case 'Add a Role':
      await addRole();
      break;
    case 'Add an Employee':
      await addEmployee();
      break;
    case 'Update an Employee Role':
      await updateEmployeeRole();
      break;
    case 'Update an employee manager':
      await updateEmployeeManager();
      break;
      case 'Delete a department':
      await deleteDepartment();
      break;
    case 'Delete a role':
      await deleteRole();
      break;
    case 'Delete an employee':
      await deleteEmployee();
      break;
      case 'View total budget utilized by a department':
        await viewTotalBudgetByDepartment();
        break;
    case 'Exit':

      console.log('Exiting...');
      process.exit(0);
    default:
      console.log("Invalid action");
  }



  await mainMenu();
};


// main menu on startup
mainMenu();