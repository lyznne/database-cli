#! bin/bash/env node
import inquirer from "inquirer";
import fs, { existsSync } from 'fs';
import boxen from "boxen";
import chalk from "chalk";
import { createSpinner } from "nanospinner";
import addData from "./addData.js";
import updateData from "./updateData.js";
// import queryDB from "./queryDB.js";
import removeData from "./removeData.js";
import retrieveData from "./retrieveData.js";
import { exit } from "process";



const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms))

async function display() {
    const title = chalk.blue('Hi, Create, Read, Write, Update and Delete !')
    const boxenOptions = {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "blue",
    };

    console.log(boxen(title, boxenOptions))
    sleep();
}

export default async function welcome() {


    const options = await inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: 'What do you want to do?',
            choices: [
                {
                    key: 1,
                    value: 'Create a new folder.',
                },
                {
                    key: 2,
                    value: 'Create a new file.',
                },
                {
                    key: 3,
                    value: 'Create new data.',
                },
                {
                    key: 4,
                    value: 'Update data.',
                },
                {
                    key: 5,
                    value: 'Retrieve data.',
                },
                {
                    key: 6,
                    value: chalk.red('Delete  data.'),
                }, {
                    key: 7,
                    value: chalk.bgRed('Exit.'),
                },
            ],
        },
    ]);

    const selectedOption = options.options;

    if (selectedOption === 'Create a new folder.') {
        createFolder();


    } else if (selectedOption === 'Create a new file.') {
        createFile();

    } else if (selectedOption === 'Create new data.') {
       addData();

    } else if (selectedOption === 'Update data.') {
      updateData();
    } else if (selectedOption === 'Retrieve data.') {
        retrieveData();
        // queryDB()
    } else if (selectedOption === 'Delete  data.') {
        removeData();
    } else if (selectedOption === 'Exit.') {
        exit();
    }
}

async function createFolder() {
    const folderName = await inquirer.prompt([
        {
            type: 'input',
            default: 'New Folder',
            message: 'Name of the folder? ',
            name: 'dir',

        }

    ]);

    const dir = folderName.dir;
    const spinner = createSpinner(`Creating ${dir} ...`).start();
    await sleep();

    try {
        fs.mkdir(dir, { recursive: true }, err => {
            if (err) {
                throw err
            }
            spinner.success(`${dir}  created.`)
        })
    } catch (error) {
        console.log(error)

    }
}
async function createFile() {
    const fileName = await inquirer.prompt([
        {
            type: 'input',
            default: 'file.txt',
            message: 'Name of the file? ',
            name: 'fileName',
        },
    ]);
    const file = fileName.fileName;
    const spinner = createSpinner(`Creating ${file}...`).start();
    await sleep();

    try {
        fs.closeSync(fs.openSync(file, 'w'));
        spinner.success(`${file} created`);
    } catch (error) {
        spinner.warn('Failed to create the file.');
        console.error(error);
    }
}

display()
welcome()

