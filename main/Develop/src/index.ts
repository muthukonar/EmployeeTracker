import inquirer from 'inquirer';
import { connectToDb } from './db/connection.js';

await connectToDb();
import { 
    viewAllDepartments,
    addDepartment
} from './db/index.js';

const mainMenu = async () => {
   const answers = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'Add a Department',
      'Exit'
    ]
  });

   switch (answers.action) {
    case 'View all departments':
      await viewAllDepartments();
      break;
    case 'Add a Department':
          await addDepartment();
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
