// import tap from "tap";
// console.log(
//     "testharnessreport",
//     "/mnt/META/wrx/ts/svgdom-ts/test/testharnessreport.js"
// );
// console.log("DEBUG", add_completion_callback);
setup(null, { explicit_timeout: true });
add_completion_callback(function (tests, status) {
    // console.log("DONE:TAP", status, tests);

    tap.test(test_name, function (t) {
        let i = 0;
        for (const test of tests) {
            test._structured_clone = null;
            t.equal(test.status, 0, `${test.name} #${++i} @${test_name}`, {
                message: test,
            });
        }

        t.end();
    });
});
