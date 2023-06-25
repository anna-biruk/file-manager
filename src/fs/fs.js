import * as fs from 'fs';
import path from 'path'


const read = async (filePath) => {
    const readableStream = fs.createReadStream(filePath, 'utf-8');

    readableStream.on('error', function (error) {
        console.log(`error: ${error.message}`);
    })

    readableStream.on('data', (chunk) => {
        console.log(chunk);
    })
}

const add = async (fileUrl) => {
    fs.writeFile(fileUrl, "", function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file is saved!");
    });
}

const rename = async (old, newName) => {
    fs.rename(old, newName, () => {
        console.log("\nFile Renamed!\n");
    })
};

const cp = async (pathToFile, pathToNewDirectory) => {
    if (pathToFile === undefined) {
        console.log('File path has not been set');

        return;
    }

    if (pathToNewDirectory === undefined) {
        console.log('File path for new file has not been set');

        return;
    }
    const readableStream = fs.createReadStream(pathToFile, "utf-8");
    const writableStream = fs.createWriteStream(pathToNewDirectory);
    readableStream.pipe(writableStream);
}
export { read, add, rename, cp }