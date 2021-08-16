from lxml import etree
from lxml import html
from os.path import join, split, exists
from pathlib import Path
from sys import stdout, stderr
from json import dumps
from os import environ, stat


WPT_ROOT = environ.get("WPT_ROOT")
WPT_DEST = environ.get("WPT_DEST") or "test/wpt"


def ofHTML(path, opt):

    full = join(WPT_ROOT, path)
    tree = html.parse(full)

    dest = join(WPT_DEST, "-".join([n for n in Path(path).parts if n]) + ".tap.mjs")
    if exists(dest) and stat(dest).st_size < 2:
        if opt.force is not True:
            print("SKIP", dest, file=stderr)
            return
    # print("MAKE", dest, file=stderr)
    root = tree.getroot()
    js = []
    inc_scripts = []
    for script in root.xpath(r"//script"):
        src = script.get("src")
        if src:
            if "testharness" in src:
                pass
            else:
                src = Path(full).parent/src
                inc_scripts.append(src.resolve())
        else:
            js.append(script.text)
            # print(script)
            script.text = None
    if opt.dry_run is False:
        fh = open(dest, "w")
    else:
        fh = stdout
    with fh as w:
        w.write(
            'import "./wpthelp.mjs"\n'
        )
        w.write(f"const html = {dumps(etree.tostring(root).decode('UTF-8'))}\n")
        w.write(f"const document = loadDOM(html)\n")
        for i, src in enumerate(inc_scripts):
            if i < 1:
                w.write(f'import fs from "fs";\n')
                w.write(f'import vm from "vm";\n')
            src = src.relative_to(WPT_ROOT)
            w.write(f'vm.runInThisContext(fs.readFileSync(`${{process.env.WPT_ROOT}}/{src}`, "utf8"))\n')
        w.write("\n".join(js))


# ;

    # tree.write(stdout.buffer, method="c14n")
import argparse

parser = argparse.ArgumentParser(description='Convert WPT test o tap')
# parser.add_argument('integers', metavar='N', type=int, nargs='+',
#                    help='an integer for the accumulator')
# parser.add_argument('--sum', dest='accumulate', action='store_const',
#                    const=sum, default=max,
#                    help='sum the integers (default: find the max)')

parser.add_argument('--force', action='store_true', default=False, help='Overwrite!')
parser.add_argument('--dry-run', action='store_true', default=False, help='Test run')
parser.add_argument('paths', nargs='*')

args = parser.parse_args()
if args.paths:
    for p in args.paths:
        ofHTML(p, args)
else:
    parser.print_help()


# print args.accumulate(args.integers)


# ofHTML("dom/nodes/CharacterData-appendData.html")
