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
  "KOI8-R": [
    "cskoi8r",
    "koi",
    "koi8",
    "koi8-r",
    "koi8_r",
  ],
  "KOI8-U": [
    "koi8-ru",
    "koi8-u",
  ],
  "macintosh": [
    "csmacintosh",
    "mac",
    "macintosh",
    "x-mac-roman",
  ],
  "windows-874": [
    "dos-874",
    "iso-8859-11",
    "iso8859-11",
    "iso885911",
    "tis-620",
    "windows-874",
  ],
  "windows-1250": [
    "cp1250",
    "windows-1250",
    "x-cp1250",
  ],
  "windows-1251": [
    "cp1251",
    "windows-1251",
    "x-cp1251",
  ],
  "windows-1252": [
    "ansi_x3.4-1968",
    "ascii",
    "cp1252",
    "cp819",
    "csisolatin1",
    "ibm819",
    "iso-8859-1",
    "iso-ir-100",
    "iso8859-1",
    "iso88591",
    "iso_8859-1",
    "iso_8859-1:1987",
    "l1",
    "latin1",
    "us-ascii",
    "windows-1252",
    "x-cp1252",
    // As we use <meta>, x-user-defined will map to windows-1252 per
    // https://html.spec.whatwg.org/multipage/#documentEncoding
    "x-user-defined"
  ],
  "windows-1253": [
    "cp1253",
    "windows-1253",
    "x-cp1253",
  ],
  "windows-1254": [
    "cp1254",
    "csisolatin5",
    "iso-8859-9",
    "iso-ir-148",
    "iso8859-9",
    "iso88599",
    "iso_8859-9",
    "iso_8859-9:1989",
    "l5",
    "latin5",
    "windows-1254",
    "x-cp1254",
  ],
  "windows-1255": [
    "cp1255",
    "windows-1255",
    "x-cp1255",
  ],
  "windows-1256": [
    "cp1256",
    "windows-1256",
    "x-cp1256",
  ],
  "windows-1257": [
    "cp1257",
    "windows-1257",
    "x-cp1257",
  ],
  "windows-1258": [
    "cp1258",
    "windows-1258",
    "x-cp1258",
  ],
  "x-mac-cyrillic": [
    "x-mac-cyrillic",
    "x-mac-ukrainian",
  ],
  "GBK": [
    "chinese",
    "csgb2312",
    "csiso58gb231280",
    "gb2312",
    "gb_2312",
    "gb_2312-80",
    "gbk",
    "iso-ir-58",
    "x-gbk",
  ],
  "gb18030": [
    "gb18030",
  ],
  "Big5": [
    "big5",
    "big5-hkscs",
    "cn-big5",
    "csbig5",
    "x-x-big5",
  ],
  "EUC-JP": [
    "cseucpkdfmtjapanese",
    "euc-jp",
    "x-euc-jp",
  ],
  "ISO-2022-JP": [
    "csiso2022jp",
    "iso-2022-jp",
  ],
  "Shift_JIS": [
    "csshiftjis",
    "ms932",
    "ms_kanji",
    "shift-jis",
    "shift_jis",
    "sjis",
    "windows-31j",
    "x-sjis",
  ],
  "EUC-KR": [
    "cseuckr",
    "csksc56011987",
    "euc-kr",
    "iso-ir-149",
    "korean",
    "ks_c_5601-1987",
    "ks_c_5601-1989",
    "ksc5601",
    "ksc_5601",
    "windows-949",
  ],
  "replacement": [
    "csiso2022kr",
    "hz-gb-2312",
    "iso-2022-cn",
    "iso-2022-cn-ext",
    "iso-2022-kr",
  ],
};

runCharacterSetTests(encodingMap);

