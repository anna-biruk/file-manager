import * as os from 'os';
import readline from 'readline';
import { up, ls, cd } from './navigation/navigation.js';
import { read, add, rename, cp } from "./fs/fs.js"
import path from 'path'


const run = () => {

    let currentDirectory = os.homedir();

    const args = process.argv.slice(2);
    let username = "";

    args.forEach((arg) => {
        if (arg.startsWith('--username=')) {
            username = arg.split('=')[1];
        }
    });

    const currentLocation = () => {
        process.stdout.write(`You are currently in ${currentDirectory}\n`);
    }

    if (username) {
        console.log(`Welcome to the File Manager, ${username}!`)
        currentLocation()
    }

    if (!username) {
        console.log('Username wasn\'t provided. Please provide username using --username argument');
        process.exit(1);
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl
        .on('SIGINT', () => {
            console.log(`Thank you for using File Manager, ${username}!`)
            process.exit(1)
        })
        .on("line", async (input) => {
            const userInput = input.trim();
            switch (userInput) {
                case "up":
                    if (await up(currentDirectory)) {
                        currentDirectory = await up(currentDirectory);
                    }
                    currentLocation();
                    break;
                case "ls":
                    ls(currentDirectory);
                    currentLocation();
            }

            if (userInput.startsWith("cd")) {
                const newPath = userInput.match(/^cd\s(.+)/)[1];
                if (await cd(currentDirectory, newPath, true)) {
                    currentDirectory = await cd(currentDirectory, newPath);
                }
                currentLocation();
            } else if (userInput.startsWith("cat")) {
                const fileName = userInput.split(" ")[1];
                read(`${currentDirectory}\\${fileName}`)
                currentLocation();
            } else if (userInput.startsWith("add")) {
                const fileName = userInput.split(" ")[1];
                const pathToFile = `${currentDirectory}\\${fileName}`;
                if (path.extname(pathToFile)) {
                    add(pathToFile);
                } else {
                    console.log(new Error("Invalid input"));
                }
            } else if (userInput.startsWith("rn")) {
                const oldFileName = userInput.split(" ")[1];
                const newFileName = userInput.split(" ")[2];
                const oldPath = `${currentDirectory}\\${oldFileName}`;
                const newPath = `${currentDirectory}\\${newFileName}`;
                rename(oldPath, newPath)
            } else if (userInput.startsWith("cp")) {
                const pathToFileName = userInput.split(" ")[1];
                const pathToNewDirectoryName = userInput.split(' ')[2];
                const urlToFile = `${currentDirectory}\\${pathToFileName}`;
                const urlToNewDirectory = `${currentDirectory}\\${pathToNewDirectoryName}`;
                cp(urlToFile, urlToNewDirectory);
            }
        })

}

run()