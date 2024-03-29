import { existsSync } from "fs";
import { rm } from "fs/promises";
import * as path from "path";
import ChildProcess from "./ChildProcess";
import toSystemJS from "./toSystemJS";

export default async function run() {

  const start = path.join(process.cwd(), "dist");

  // clearing dist...
  if (existsSync(start)) {
    await rm(start, { recursive: true, force: true});
  }

  const tsPath = require.resolve("typescript/lib/tsc.js");
  await ChildProcess("node",[tsPath, "--module" , "esnext", "--importHelpers", "true"]);

  await toSystemJS(start);

}
