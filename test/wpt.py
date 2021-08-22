from lxml import etree
from lxml import html
from os.path import join, split, exists
from pathlib import Path
from sys import stdout, stderr
from json import dumps
from os import environ, stat


WPT_ROOT = environ.get("WPT_ROOT")
WPT_DEST = environ.get("WPT_DEST") or "test/wpt"
SUFFIX = ".tap.mjs"

def ofHTML(path, opt):
    full = Path(path).resolve()

    # full = Path(join(WPT_ROOT, path)).resolve()
    is_xml = ".htm" not in full.suffix
    tree = (is_xml and etree or html).parse(str(full))

    dest = join(WPT_DEST, "-".join([n for n in full.relative_to(Path(WPT_ROOT)).parts if n]) + SUFFIX)
    if exists(dest) and stat(dest).st_size < 2:
        if opt.force is not True:
            print("SKIP", dest, file=stderr)
            return
    # print("MAKE", dest, file=stderr)
    root = tree.getroot()
    js = []
    inc_scripts = []
    for script in root.iter("{*}script"):
        src = script.get("src")
        if src:
            if "testharness" in src:
                pass
            else:
                src = full.parent / src
                inc_scripts.append(src.resolve())
        else:
            script.text  and js.append(script.text)
            # print(script)
            script.text = None
    if opt.dry_run is False:
        fh = open(dest, "w")
    else:
        fh = stdout

    with fh as w:

        def line(s):
            w.write(s)
            w.write("\n")

        line(r'import * as all from "../../dist/all.js";')
        line(r"for (const [k, v] of Object.entries(all)) {")
        line(r"  global[k] = v;")
        line(r"}")
        line('import "./wpthelp.mjs"')
        line(f"const html = {dumps(etree.tostring(root).decode('UTF-8'))}")
        line(
            f"const document = loadDOM(html, {is_xml and '`application/xml`' or '`text/html`'})"
        )

        for i, src in enumerate(inc_scripts):
            if i < 1:
                line(f'import fs from "fs";')
                line(f'import vm from "vm";')
            src = src.relative_to(WPT_ROOT)
            line(f"const src{i} = `${{process.env.WPT_ROOT}}/{src}`;")
            line(f'vm.runInThisContext(fs.readFileSync(src{i}, "utf8"), src{i})')
        w.write("\n".join(js))


# ;

# tree.write(stdout.buffer, method="c14n")
import argparse

parser = argparse.ArgumentParser(description="Convert WPT test o tap")
# parser.add_argument('integers', metavar='N', type=int, nargs='+',
#                    help='an integer for the accumulator')
# parser.add_argument('--sum', dest='accumulate', action='store_const',
#                    const=sum, default=max,
#                    help='sum the integers (default: find the max)')

parser.add_argument("--force", action="store_true", default=False, help="Overwrite!")
parser.add_argument("--dry-run", action="store_true", default=False, help="Test run")
parser.add_argument("paths", nargs="*")

args = parser.parse_args()
if args.paths:
    for p in args.paths:
        ofHTML(p, args)
else:
    parser.print_help()


# print args.accumulate(args.integers)


# ofHTML("dom/nodes/CharacterData-appendData.html")
