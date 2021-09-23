import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html>\n    <head>\n        <title>CSSOM: CSSStyleDeclaration (set|remove)PropertyValue sets/removes shorthand properties</title>\n        <link rel=\"author\" title=\"Paul Irish\" href=\"mailto:paul.irish@gmail.com\"/>\n        <link rel=\"help\" href=\"http://www.w3.org/TR/cssom-1/#the-cssstyledeclaration-interface\"/>\n\n        <link rel=\"source\" href=\"http://trac.webkit.org/export/120528/trunk/LayoutTests/fast/css/cssom-remove-shorthand-property.html\"/>\n        <meta name=\"flags\" content=\"dom\"/>\n\n        <script src=\"/resources/testharness.js\"/>\n        <script src=\"/resources/testharnessreport.js\"/>\n    </head>\n\n    <body>\n        <div id=\"log\"/>\n\n        <div id=\"box\"/>\n\n        <script/>\n    </body>\n</html>"
const document = loadDOM(html, `text/html`)

            var shorthandProperties = [
                "font",
                "border-top",
                "border-right",
                "border-bottom",
                "border-left",
                "border",
                "border-color",
                "border-style",
                "border-width",
                "background-position",
                "background-repeat",
                "border-spacing",
                "list-style",
                "margin",
                "outline",
                "padding",
                "background",
                "overflow",
                "border-radius"
            ];

            var element = document.createElement('span');

            function canSetProperty(propertyName, priority) {
                element.style.setProperty(propertyName, 'initial', priority);
                return element.style.getPropertyValue(propertyName) == 'initial';
            }

            function canRemoveProperty(propertyName) {
                element.style.removeProperty(propertyName);
                return element.style.getPropertyValue(propertyName) != 'initial';
            }

            for (var i = 0; i < shorthandProperties.length; ++i) {
                var propertyName = shorthandProperties[i];

                test(function(){
                    assert_true(canSetProperty(propertyName, ''), 'can setPropertyValue with shorthand');
                }, 'shorthand ' + propertyName + ' can be set with setProperty');

                test(function(){
                    assert_true(canRemoveProperty(propertyName), 'can setPropertyValue with shorthand');
                }, 'shorthand ' + propertyName + ' can be removed with removeProperty');

                test(function(){
                    assert_true(canSetProperty(propertyName, 'important'), 'can setPropertyValue with shorthand');
                }, 'shorthand ' + propertyName + ' can be set with setProperty and priority !important');

                test(function(){
                    assert_true(canRemoveProperty(propertyName), 'can setPropertyValue with shorthand');
                }, 'shorthand ' + propertyName + ' can be removed with removeProperty even when set with !important');

            }
        