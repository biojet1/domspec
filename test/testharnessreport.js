// import tap from "tap";
// console.log(
//     "testharnessreport",
//     "/mnt/META/wrx/ts/svgdom-ts/test/testharnessreport.js"
// );

add_completion_callback(function (tests, status) {
    // console.log("DONE:TAP", status, tests);
    for (const test of tests) {
        tap.equal(test.status, 0, test.name, {
            message: test.message,
        });
    }
});
