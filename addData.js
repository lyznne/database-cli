import inquirer from "inquirer";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { createSpinner } from "nanospinner";
import dbFileCheck from "./dbFileCheck.js";
import welcome from "./index.js";
import db from "./db.js";


const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

export default async function addData(info) {
  try {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "What's your name?",
      },
      {
        type: "number",
        name: "phone",
        message: "What's your phone number?",
      },
      {
        type: "list",
        name: "age",
        message: "Are you an adult?",
        choices: [
          { name: "Y", value: "Adult" },
          { name: "N", value: "Minor" },
        ],
      },
      {
        type: "input",
        name: "email",
        message: "What's your email address?",
      },
      {
        type: "input",
        name: "address",
        message: "What's your address?",
      },
    ]);

    const data = {
      id: uuidv4(),
      name: answers.name,
      phone: answers.phone,
      age: answers.age,
      email: answers.email,
      address: answers.address,
    };

    info.push(data);

  
    db.serialize(() => {

      const stmt = db.prepare(
        "INSERT INTO users (id, name, phone, age, email, address) VALUES (?, ?, ?, ?, ?, ?)"
      );

      stmt.run(
        data.id,
        data.name,
        data.phone,
        data.age,
        data.email,
        data.address
      );

      stmt.finalize();
    });

    db.close();

    if (fs.existsSync("db.json")) {
      dbFileCheck();
      createDetails(info);
    } else {
      fs.appendFile("db.json", "[]", (err) => {
        if (err) {
          spinner.warn(`Could not create db.json file. ${err} `);
          return;
        }
        createDetails(info);
      });
    }
  } catch (error) {
    console.log(`Something went wrong!, ${error}`);
  }
}

async function createDetails(info) {
  fs.writeFile("db.json", JSON.stringify(info), async function (err) {
    if (err) {
      console.log(err);
    }
    const spinner = createSpinner("Saving ...").start();
    await sleep();
    spinner.success("Saved!!");
    await sleep();
    console.log("\n  ");
    await welcome();
  });
}
