import * as os from 'os';
import readline from 'readline';
import { up, ls, cd } from './navigation/navigation.js'


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
                    currentLocation()

            }

            if (userInput.startsWith("cd")) {
                const newPath = userInput.match(/^cd\s(.+)/)[1];
                if (await cd(currentDirectory, newPath, true)) {
                    currentDirectory = await cd(currentDirectory, newPath);
                }
                currentLocation();
            }

        })

}

run()