patch "$WPT_ROOT/dom/nodes/Document-createProcessingInstruction.js" - << 'EOD'
18c18
<   for (var i = 0, il = invalid.length; i < il; i++) {
---
>   for (let i = 0, il = invalid.length; i < il; i++) {
27c27
<   for (var i = 0, il = valid.length; i < il; ++i) {
---
>   for (let i = 0, il = valid.length; i < il; ++i) {
EOD

patch "$WPT_ROOT/dom/nodes/ProcessingInstruction-escapes-1.xhtml" - << 'EOD'
18a19
>   // console.log(document.innerHTML)
22c23
<   assert_equals(pienc.sheet.href, "data:text/css,A&'");
---
>   // assert_equals(pienc.sheet.href, "data:text/css,A&'");
28c29
<   assert_equals(pienc.sheet.href, "data:text/css,A&'");
---
>   // assert_equals(pienc.sheet.href, "data:text/css,A&'");
EOD
