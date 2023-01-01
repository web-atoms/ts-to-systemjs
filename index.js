const { default: run } = require("./dist/index.js");
run().catch((e) => console.error(e.stack ? e.stack + "\r\n" + e : e));
