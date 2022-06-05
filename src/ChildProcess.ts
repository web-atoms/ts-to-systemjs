import { spawn } from "child_process";

export default function ChildProcess(program, params) {
    return new Promise((resolve, reject) => {
        const p = spawn(program, params);
        p.addListener("exit", () => {
            resolve(p.exitCode);
        });
        p.addListener("error", reject);
    });
}