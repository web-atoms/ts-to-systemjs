import { readdir, writeFile, readFile, unlink } from "fs/promises";
import * as babel from "@babel/core";
import changeExtension from "./changeExtension";
import path = require("path");

export default async function toSystemJS(dir) {

    const files = await readdir(dir, { withFileTypes: true });
    const all = [];
    for (const iterator of files) {
        const fullPath = path.join(dir, iterator.name);
        if (iterator.isDirectory()) {
            all.push(toSystemJS(fullPath));
            continue;
        }
        if (iterator.name.endsWith(".esm.js")) {
            all.push(transform(fullPath));
        }
    }

    await Promise.all(all);
}

const presets = {
    sourceType: "module",
    sourceMaps: true,
    comments: false,
    "plugins": [
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-transform-modules-systemjs"
    ]
};

async function transform(name: string) {
    // const code = await readFile(name, "utf-8" );
    const result = await babel.transformFileAsync(name, presets);
    const target = changeExtension(name, ".esm.js", ".sys.js");
    const { base: baseName } = path.parse(target);
    await writeFile(target, result.code + `\r\n//# sourceMappingURL=${baseName}.map`);
    await writeFile(target + ".map", JSON.stringify(result.map));
    await unlink(name);
}

