import { spawn } from "child_process";
import * as path from "path";
import changeExtension from "./changeExtension";
import ChildProcess from "./ChildProcess";
import renameFiles from "./renameFiles";
import toSystemJS from "./toSystemJS";
import { setupTsToES, undoConfig } from "./tsConfig";

async function run() {
  setupTsToES();

  const tsPath = path.join(__dirname, "../node_modules/typescript/lib/tsc.js");

  await ChildProcess("node",[tsPath]);
  // require('../node_modules/typescript/lib/tsc.js');

  const start = path.join(process.cwd(), "dist");

  await renameFiles(start, (name) => !/\.(sys|esm)\.js$/i.test(name)
    ? changeExtension(name, ".js", ".esm.js")
    : name);

  await toSystemJS(start);

  undoConfig();

  await ChildProcess("node",[tsPath]);

}

run().catch((e) => console.error(e.stack ? e.stack + "\r\n" + e : e));