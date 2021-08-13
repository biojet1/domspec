from lxml import etree
from lxml import html
from os.path import join, split, exists
from pathlib import Path
from sys import stdout, stderr
from json import dumps
from os import environ


WPT_ROOT = environ.get("WPT_ROOT")
WPT_DEST = environ.get("WPT_DEST") or "test/wpt"


def ofHTML(path, force=False):

    full = join(WPT_ROOT, path)
    tree = html.parse(full)

    dest = join(WPT_DEST, "-".join([n for n in Path(path).parts if n]) + ".tap.mjs")
    if exists(dest):
        if force is not True:
            print("SKIP", dest)
            return
    print("MAKE", dest)
    root = tree.getroot()
    js = []
    for script in root.xpath(r"//script"):
        if not script.get("src"):
            js.append(script.text)
            # print(script)
            script.text = None

    with open(dest, "w") as w:
        w.write(
            'import "./wpthelp.mjs"\n'
        )
        w.write(f"const html = {dumps(etree.tostring(root).decode('UTF-8'))}\n")
        w.write(f"const document = loadDOM(html)\n")
        w.write("\n".join(js))

    # tree.write(stdout.buffer, method="c14n")
import argparse

parser = argparse.ArgumentParser(description='Convert WPT test o tap')
# parser.add_argument('integers', metavar='N', type=int, nargs='+',
#                    help='an integer for the accumulator')
# parser.add_argument('--sum', dest='accumulate', action='store_const',
#                    const=sum, default=max,
#                    help='sum the integers (default: find the max)')

parser.add_argument('--force', type=bool, default=False, help='Overwrite!')
parser.add_argument('paths', nargs='*')

args = parser.parse_args()
if args.paths:
    for p in args.paths:
        ofHTML(p, args.force)
else:
    parser.print_help()


# print args.accumulate(args.integers)


# ofHTML("dom/nodes/CharacterData-appendData.html")
