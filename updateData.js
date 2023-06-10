import inquirer from "inquirer";
import fs from "fs";
import welcome from "./index.js";
import dbFileCheck from "./dbFileCheck.js";
import db from "./db.js"; 

export default async function updateData(info) {
  dbFileCheck();

  try {
    const db = new sqlite3.Database("database.db");

    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Enter name",
      },
    ]);

    db.serialize(() => {
      db.get("SELECT * FROM users WHERE name = ?", answers.name, (err, row) => {
        if (err) {
          console.log(err);
          return;
        }

        if (row) {
          const current = {
            name: row.name,
            phone: row.phone,
            age: row.age,
            email: row.email,
            address: row.address,
          };

          updateDetails(current, info);
        } else {
          console.log("Record not found.");
          db.close();
        }
      });
    });
  } catch (error) {
    console.log(`Something went wrong! ${error}`);
  }
}

async function updateDetails(current, info) {
  try {
    const feedbacks = await inquirer.prompt([
      {
        type: "input",
        default: current.name,
        name: "name",
        message: "What's your new name?",
      },
      {
        type: "number",
        default: current.phone,
        name: "phone",
        message: "What's your new phone number?",
      },
      {
        type: "list",
        default: current.age,
        name: "age",
        message: "What's your age?",
        choices: [
          { name: "Y", value: "Adult" },
          { name: "N", value: "Minor" },
        ],
      },
      {
        type: "input",
        default: current.email,
        name: "email",
        message: "What's your new email address?",
      },
      {
        type: "input",
        default: current.address,
        name: "address",
        message: "What's your new address?",
      },
    ]);

  

    db.serialize(() => {
      db.run(
        `UPDATE users SET 
        name = ?, 
        phone = ?, 
        age = ?, 
        email = ?, 
        address = ? 
        WHERE name = ?`,
        [
          feedbacks.name,
          feedbacks.phone,
          feedbacks.age,
          feedbacks.email,
          feedbacks.address,
          current.name,
        ],
        (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Updated!");
          }

          db.close();
        }
      );
    });

    console.log("\n  ");
    await welcome();
  } catch (error) {
    console.log(`Something went wrong! ${error}`);
  }
}
