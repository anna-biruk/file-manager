import path from "path";
import fs from "fs/promises";

const up = async (dir) => {
    return path.join(dir, "../");
}

const ls = async (dir) => {
    const filesArray = [];
    const foldersArray = [];
    const files = await fs.readdir(dir, { withFileTypes: true });
    const filteredFiles = files.filter((file) => file.isDirectory() || file.isFile());

    filteredFiles.forEach((file) => {
        file.isDirectory() ? foldersArray.push({
            Name: file.name,
            Type: 'directory'
        }) : filesArray.push({
            Name: file.name,
            Type: 'file'
        })
    })

    console.table([...foldersArray, ...filesArray])
};

const cd = async (directory, newPath, check) => {
    if (check) {
        try {
            await fs.access(
                path.join(directory, newPath),
                fs.constants.R_OK | fs.constants.F_OK)

        } catch (err) {
            console.log(new Error("Operation failed"));
            return null;
        }

    }

    if (path.isAbsolute(newPath)) {
        return newPath;
    } else {
        return path.join(directory, newPath);
    }
}

export { up, ls, cd }