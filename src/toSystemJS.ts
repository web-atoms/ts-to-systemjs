import { readdir, writeFile, readFile, unlink } from "fs/promises";
import * as babel from "@babel/core";
import changeExtension from "./changeExtension";
import path = require("path");
import { readdirSync } from "fs";

function enumerateAll(dir, all?) {
    all ??= [];
    const files = readdirSync(dir, { withFileTypes: true });
    for (const iterator of files) {
        const fullPath = path.join(dir, iterator.name);
        if (iterator.isDirectory()) {
            enumerateAll(fullPath, all);
            continue;
        }
        if (iterator.name.endsWith(".js")) {
            all.push(transform(fullPath));
        }        
    }
    return all;
}

export default async function toSystemJS(dir) {

    // const files = await readdir(dir, { withFileTypes: true });
    const all = enumerateAll(dir);
    // for (const iterator of files) {
    //     const fullPath = path.join(dir, iterator.name);
    //     if (iterator.isDirectory()) {
    //         all.push(toSystemJS(fullPath));
    //         continue;
    //     }
    //     if (iterator.name.endsWith(".js")) {
    //         all.push(transform(fullPath));
    //     }
    // }

    await Promise.all(all);
}

const presets = {
    sourceType: "module",
    sourceMaps: true,
    compact: false,
    comments: false,
    getModuleId: () => "v",
    "plugins": [
        require.resolve("@babel/plugin-syntax-explicit-resource-management"),
        require.resolve("@babel/plugin-proposal-explicit-resource-management"),
        require.resolve("@babel/plugin-transform-dynamic-import"),
        require.resolve("@babel/plugin-transform-modules-systemjs"),
    ]
};

async function transform(name: string) {
    console.log(`Transforming from esm to systemjs ${name}`);
    // const code = await readFile(name, "utf-8" );
    const result = await babel.transformFileAsync(name, presets);
    // const target = changeExtension(name, ".esm.js", ".sys.js");
    const target = name;
    const { base: baseName } = path.parse(target);
    await writeFile(target, result.code + `\r\n//# sourceMappingURL=${baseName}.map`);
    await writeFile(target + ".map", JSON.stringify(result.map));
    // await unlink(name);
    console.log(`Saved ${name}`);
}

