import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><title>document.characterSet (inputEncoding and charset as aliases) normalization tests</title>\n<link rel=\"author\" title=\"Aryeh Gregor\" href=\"ayg@aryeh.name\"/>\n<meta name=\"timeout\" content=\"long\"/>\n</head><body><div id=\"log\"/>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n<script src=\"./characterset-helper.js\"/>\n<style>iframe { display: none }</style>\n<script/>\n<!-- vim: set expandtab tabstop=2 shiftwidth=2: -->\n</body></html>"
const document = loadDOM(html, `text/html`)
import fs from "fs";
import vm from "vm";
const src0 = `${process.env.WPT_ROOT}/dom/nodes/characterset-helper.js`;
vm.runInThisContext(fs.readFileSync(src0, "utf8"), src0)

"use strict";

// Taken straight from https://encoding.spec.whatwg.org/
var encodingMap = {
  "UTF-8": [
    "unicode-1-1-utf-8",
    "utf-8",
    "utf8",
    // As we use <meta>, utf-16 will map to utf-8 per
    // https://html.spec.whatwg.org/multipage/#documentEncoding
    "utf-16",
    "utf-16le",
    "utf-16be",
  ],
  "IBM866": [
    "866",
    "cp866",
    "csibm866",
    "ibm866",
  ],
  "ISO-8859-2": [
    "csisolatin2",
    "iso-8859-2",
    "iso-ir-101",
    "iso8859-2",
    "iso88592",
    "iso_8859-2",
    "iso_8859-2:1987",
    "l2",
    "latin2",
  ],
  "ISO-8859-3": [
    "csisolatin3",
    "iso-8859-3",
    "iso-ir-109",
    "iso8859-3",
    "iso88593",
    "iso_8859-3",
    "iso_8859-3:1988",
    "l3",
    "latin3",
  ],
  "ISO-8859-4": [
    "csisolatin4",
    "iso-8859-4",
    "iso-ir-110",
    "iso8859-4",
    "iso88594",
    "iso_8859-4",
    "iso_8859-4:1988",
    "l4",
    "latin4",
  ],
  "ISO-8859-5": [
    "csisolatincyrillic",
    "cyrillic",
    "iso-8859-5",
    "iso-ir-144",
    "iso8859-5",
    "iso88595",
    "iso_8859-5",
    "iso_8859-5:1988",
  ],
  "ISO-8859-6": [
    "arabic",
    "asmo-708",
    "csiso88596e",
    "csiso88596i",
    "csisolatinarabic",
    "ecma-114",
    "iso-8859-6",
    "iso-8859-6-e",
    "iso-8859-6-i",
    "iso-ir-127",
    "iso8859-6",
    "iso88596",
    "iso_8859-6",
    "iso_8859-6:1987",
  ],
  "ISO-8859-7": [
    "csisolatingreek",
    "ecma-118",
    "elot_928",
    "greek",
    "greek8",
    "iso-8859-7",
    "iso-ir-126",
    "iso8859-7",
    "iso88597",
    "iso_8859-7",
    "iso_8859-7:1987",
    "sun_eu_greek",
  ],
  "ISO-8859-8": [
    "csiso88598e",
    "csisolatinhebrew",
    "hebrew",
    "iso-8859-8",
    "iso-8859-8-e",
    "iso-ir-138",
    "iso8859-8",
    "iso88598",
    "iso_8859-8",
    "iso_8859-8:1988",
    "visual",
  ],
  "ISO-8859-8-I": [
    "csiso88598i",
    "iso-8859-8-i",
    "logical",
  ],
  "ISO-8859-10": [
    "csisolatin6",
    "iso-8859-10",
    "iso-ir-157",
    "iso8859-10",
    "iso885910",
    "l6",
    "latin6",
  ],
  "ISO-8859-13": [
    "iso-8859-13",
    "iso8859-13",
    "iso885913",
  ],
  "ISO-8859-14": [
    "iso-8859-14",
    "iso8859-14",
    "iso885914",
  ],
  "ISO-8859-15": [
    "csisolatin9",
    "iso-8859-15",
    "iso8859-15",
    "iso885915",
    "iso_8859-15",
    "l9",
  ],
  "ISO-8859-16": [
    "iso-8859-16",
  ],
};

runCharacterSetTests(encodingMap);

