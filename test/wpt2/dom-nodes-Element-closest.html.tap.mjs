import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html><head><meta charset=\"utf8\"/>\n<title>Test for Element.closest</title>\n<script src=\"/resources/testharness.js\"/>\n<script src=\"/resources/testharnessreport.js\"/>\n</head><body id=\"body\">\n  <div id=\"test8\" class=\"div3\" style=\"display:none\">\n    <div id=\"test7\" class=\"div2\">\n      <div id=\"test6\" class=\"div1\">\n        <form id=\"test10\" class=\"form2\"/>\n        <form id=\"test5\" class=\"form1\" name=\"form-a\">\n          <input id=\"test1\" class=\"input1\" required=\"\"/>\n          <fieldset class=\"fieldset2\" id=\"test2\">\n            <select id=\"test3\" class=\"select1\" required=\"\">\n              <option default=\"\" id=\"test4\" value=\"\">Test4</option>\n              <option selected=\"selected\" id=\"test11\">Test11</option>\n              <option id=\"test12\">Test12</option>\n              <option id=\"test13\">Test13</option>\n            </select>\n            <input id=\"test9\" type=\"text\" required=\"\"/>\n          </fieldset>\n        </form>\n      </div>\n    </div>\n  </div>\n  <div id=\"log\"/>\n<script/>\n</body></html>"
const document = loadDOM(html, `text/html`)

  do_test("select"                     , "test12", "test3");
  do_test("fieldset"                   , "test13", "test2");
  do_test("div"                        , "test13", "test6");
  do_test("body"                       , "test3" , "body");

  do_test("[default]"                  , "test4" , "test4");
  do_test("[selected]"                 , "test4" , "");
  do_test("[selected]"                 , "test11", "test11");
  do_test('[name="form-a"]'            , "test12", "test5");
  do_test('form[name="form-a"]'        , "test13", "test5");
  do_test("input[required]"            , "test9" , "test9");
  do_test("select[required]"           , "test9" , "");

  do_test("div:not(.div1)"             , "test13", "test7");
  do_test("div.div3"                   , "test6" , "test8");
  do_test("div#test7"                  , "test1" , "test7");

  do_test(".div3 > .div2"              , "test12", "test7");
  do_test(".div3 > .div1"              , "test12", "");
  do_test("form > input[required]"     , "test9" , "");
  do_test("fieldset > select[required]", "test12", "test3");

  do_test("input + fieldset"           , "test6" , "");
  do_test("form + form"                , "test3" , "test5");
  do_test("form + form"                , "test5" , "test5");

  do_test(":empty"                     , "test10", "test10");
  do_test(":last-child"                , "test11", "test2");
  do_test(":first-child"               , "test12", "test3");
  do_test(":invalid"                   , "test11", "test2");

  do_test(":scope"                     , "test4",  "test4");
  do_test("select > :scope"            , "test4",  "test4");
  do_test("div > :scope"               , "test4",  "");
  do_test(":has(> :scope)"             , "test4",  "test3");
function do_test(aSelector, aElementId, aTargetId) {
  test(function() {
    var el = document.getElementById(aElementId).closest(aSelector);
    if (el === null) {
      assert_equals("", aTargetId, aSelector);
    } else {
      assert_equals(el.id, aTargetId, aSelector);
    }
  }, "Element.closest with context node '" + aElementId + "' and selector '" + aSelector + "'");
}
