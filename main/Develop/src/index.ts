import inquirer from 'inquirer';
import { connectToDb } from './db/connection.js';

await connectToDb();
import { 
    viewAllDepartments,
    viewAllRoles,
    viewAllEmployees,
    addDepartment,
    addRole
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
    case 'Exit':

      console.log('Exiting...');
      return; 
    default:
      console.log("Invalid action");
  }



    await mainMenu();
};


// main menu on startup
mainMenu();