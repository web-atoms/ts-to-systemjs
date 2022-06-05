import { renameSync } from "fs";
import { readdir } from "fs/promises";
import path = require("path");

export default async function renameFiles(dir: string, change: (name: string) => string) {

    const results = await readdir(dir, { withFileTypes: true});
    const all = [];

    for (const iterator of results) {
        const fullPath = path.join(dir, iterator.name);
        if (iterator.isDirectory()) {
            all.push(renameFiles(fullPath, change));
            continue;
        }
        const newName = change(fullPath);
        if (newName !== fullPath) {
            renameSync(fullPath, newName);
        }
    }

    await Promise.all(all);

}
