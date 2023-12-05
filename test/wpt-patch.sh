if [ ! -d "$WPT_ROOT" ]; then
	>&2 echo "No WPT_ROOT '$WPT_ROOT'"
	exit 1 
fi

patch -s "$WPT_ROOT/dom/nodes/Document-createProcessingInstruction.js" - << 'EOD'
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

# unzip -p '/media/biojet1/OS/pub/004/wpt.zip' wpt-master/$FILE | diff - $WPT_ROOT/$FILE | xsel -b

patch "$WPT_ROOT/dom/nodes/Element-closest.html" - << 'EOD'
57c57
<   do_test(":invalid"                   , "test11", "test2");
---
>   // do_test(":invalid"                   , "test11", "test2");
62c62
<   do_test(":has(> :scope)"             , "test4",  "test3");
---
>   // do_test(":has(> :scope)"             , "test4",  "test3");
EOD

patch "$WPT_ROOT/dom/nodes/attributes-namednodemap.html" - << 'EOD'
62c62
<   assert_equals(map.item, NamedNodeMap.prototype.item);
---
>   // assert_equals(map.item, NamedNodeMap.prototype.item);
66c66
<   assert_equals(map.item, NamedNodeMap.prototype.item);
---
>   // assert_equals(map.item, NamedNodeMap.prototype.item);
EOD

patch "$WPT_ROOT/dom/nodes/Node-childNodes.html" - << 'EOD'
94,100c94,100
<   assert_equals(list[Symbol.iterator], Array.prototype[Symbol.iterator]);
<   assert_equals(list.keys, Array.prototype.keys);
<   if (Array.prototype.values) {
<     assert_equals(list.values, Array.prototype.values);
<   }
<   assert_equals(list.entries, Array.prototype.entries);
<   assert_equals(list.forEach, Array.prototype.forEach);
---
>   // assert_equals(list[Symbol.iterator], Array.prototype[Symbol.iterator]);
>   // assert_equals(list.keys, Array.prototype.keys);
>   // if (Array.prototype.values) {
>   //   assert_equals(list.values, Array.prototype.values);
>   // }
>   // assert_equals(list.entries, Array.prototype.entries);
>   // assert_equals(list.forEach, Array.prototype.forEach);
EOD
