import { readFileSync, writeFileSync } from "fs";
import path = require("path");
import * as process from "process";

const cwd = process.cwd();
const packageJsonFile = path.join(cwd, "tsconfig.json");

const originalJson = readFileSync(packageJsonFile, "utf-8");
const json = JSON.parse(originalJson);

json.compilerOptions.module = "ESNext";

export function setupTsToES() {
    writeFileSync(packageJsonFile, JSON.stringify(json));
}

export function undoConfig() {
    writeFileSync(packageJsonFile, originalJson);
}
