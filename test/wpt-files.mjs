import fs from "fs";
// import vm from "vm";
import glob from "glob";
import path from "path";

const data = fs.readFileSync("test/wpt-run.tap.mjs", "utf8");

let tests = data.match(/tests\s*=\s*`([^`]+)/m)[1];

tests = tests
    .split(/[\r\n]+/)
    .map((v) => v.trim())
    .filter((v) => v && !v.startsWith("#") && !v.startsWith("//"));


glob("test/wpt-o?/*.tap.?js", {}, function (er, files) {
    const names = files.map((v) => {
        v = path.basename(v);
        v = v.replace(/\-/, "/");
        v = v.replace(/\-/, "/");
        v = v.replace(".tap.mjs", "");
        return v;
    });
    const names0 = new Set(tests);

    const names1 = names.filter((v) => !names0.has(v)).sort();
    for (const v of names1) console.log(v);
    console.log(names1.length);
});
