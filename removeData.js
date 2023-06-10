import inquirer from "inquirer";
import db from "./db.js";
import welcome from "./index.js";

export default async function removeData(info) {
  try {

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter name',
      },
    ]);

    db.run(`DELETE FROM users WHERE name = ?`, [answers.name], function (err) {
      if (err) {
        console.log(`Error deleting data: ${err.message}`);
        return;
      }
      console.log('Deleted!');
    });

    console.log('\n');
    await welcome();
  } catch (error) {
    console.log(`Something went wrong! ${error}`);
  }
}
