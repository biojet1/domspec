import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<html>\n  <head>\n    <meta charset=\"utf-8\"/>\n    <title>Element Reflection for aria-activedescendant and aria-errormessage</title>\n    <link rel=\"help\" href=\"https://whatpr.org/html/3917/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes:element\"/>\n    <link rel=\"author\" title=\"Meredith Lane\" href=\"meredithl@chromium.org\"/>\n    <script src=\"/resources/testharness.js\"/>\n    <script src=\"/resources/testharnessreport.js\"/>\n  </head>\n\n  <body><div id=\"activedescendant\" aria-activedescendant=\"x\"/>\n\n  <div id=\"parentListbox\" role=\"listbox\" aria-activedescendant=\"i1\">\n    <div role=\"option\" id=\"i1\">Item 1</div>\n    <div role=\"option\" id=\"i2\">Item 2</div>\n  </div>\n\n  <script/>\n\n  <div id=\"parentListbox2\" role=\"listbox\" aria-activedescendant=\"option1\">\n    <div role=\"option\" id=\"option1\">Item 1</div>\n    <div role=\"option\" id=\"option2\">Item 2</div>\n  </div>\n\n  <script/>\n\n  <div id=\"blankIdParent\" role=\"listbox\">\n    <div role=\"option\" id=\"multiple-id\"/>\n    <div role=\"option\" id=\"multiple-id\"/>\n  </div>\n\n  <script/>\n\n  <div id=\"outerContainer\">\n    <p id=\"lightParagraph\">Hello world!</p>\n    <span id=\"shadowHost\">\n    </span>\n  </div>\n\n  <script/>\n\n  <input id=\"startTime\"/>\n  <span id=\"errorMessage\">Invalid Time</span>\n\n  <script/>\n\n  <label>\n    Password:\n    <input id=\"passwordField\" type=\"password\" aria-details=\"pw\"/>\n  </label>\n\n  <ul>\n    <li id=\"listItem1\">First description.</li>\n    <li id=\"listItem2\">Second description.</li>\n  </ul>\n\n  <script/>\n\n  <div id=\"deletionParent\" role=\"listbox\" aria-activedescendant=\"contentAttrElement\">\n    <div role=\"option\" id=\"contentAttrElement\">Item 1</div>\n    <div role=\"option\" id=\"idlAttrElement\">Item 2</div>\n  </div>\n\n  <script/>\n\n  <div id=\"parentNode\" role=\"listbox\" aria-activedescendant=\"changingIdElement\">\n    <div role=\"option\" id=\"changingIdElement\">Item 1</div>\n    <div role=\"option\" id=\"persistantIDElement\">Item 2</div>\n  </div>\n\n  <script/>\n\n  <!-- TODO(chrishall): change naming scheme to inner/outer -->\n  <div id=\"lightParent\" role=\"listbox\">\n    <div id=\"lightElement\" role=\"option\">Hello world!</div>\n  </div>\n  <div id=\"shadowHostElement\"/>\n\n  <script/>\n\n  <div id=\"fruitbowl\" role=\"listbox\">\n    <div id=\"apple\" role=\"option\">I am an apple</div>\n    <div id=\"pear\" role=\"option\">I am a pear</div>\n    <div id=\"banana\" role=\"option\">I am a banana</div>\n  </div>\n  <div id=\"shadowFridge\"/>\n\n  <script/>\n\n  <div id=\"toaster\" role=\"listbox\"/>\n  <div id=\"shadowPantry\"/>\n\n  <script/>\n\n  <div id=\"billingElementContainer\">\n      <div id=\"billingElement\">Billing</div>\n  </div>\n  <div>\n      <div id=\"nameElement\">Name</div>\n      <input type=\"text\" id=\"input1\" aria-labelledby=\"billingElement nameElement\"/>\n  </div>\n  <div>\n      <div id=\"addressElement\">Address</div>\n      <input type=\"text\" id=\"input2\"/>\n  </div>\n\n  <script/>\n\n  <ul role=\"tablist\">\n    <li role=\"presentation\"><a id=\"link1\" role=\"tab\" aria-controls=\"panel1\">Tab 1</a></li>\n    <li role=\"presentation\"><a id=\"link2\" role=\"tab\">Tab 2</a></li>\n  </ul>\n\n  <div role=\"tabpanel\" id=\"panel1\"/>\n  <div role=\"tabpanel\" id=\"panel2\"/>\n\n  <script/>\n\n  <a id=\"describedLink\" aria-describedby=\"description1 description2\">Fruit</a>\n  <div id=\"description1\">Delicious</div>\n  <div id=\"description2\">Nutritious</div>\n\n  <script/>\n\n  <h2 id=\"titleHeading\" aria-flowto=\"article1 article2\">Title</h2>\n  <div>Next</div>\n  <article id=\"article2\">Content2</article>\n  <article id=\"article1\">Content1</article>\n\n  <script/>\n\n  <ul>\n    <li id=\"listItemOwner\" aria-owns=\"child1 child2\">Parent</li>\n  </ul>\n  <ul>\n    <li id=\"child1\">Child 1</li>\n    <li id=\"child2\">Child 2</li>\n  </ul>\n  <script/>\n\n  <div id=\"lightDomContainer\">\n    <h2 id=\"lightDomHeading\" aria-flowto=\"shadowChild1 shadowChild2\">Light DOM Heading</h2>\n    <div id=\"host\"/>\n    <p id=\"lightDomText1\">Light DOM text</p>\n    <p id=\"lightDomText2\">Light DOM text</p>\n  </div>\n\n  <script/>\n\n  <div id=\"describedButtonContainer\">\n    <div id=\"buttonDescription1\">Delicious</div>\n    <div id=\"buttonDescription2\">Nutritious</div>\n    <div id=\"outerShadowHost\"/>\n  </div>\n\n  <script/>\n\n  <div id=\"sameScopeContainer\">\n    <div id=\"labeledby\" aria-labeledby=\"headingLabel1 headingLabel2\">Misspelling</div>\n    <div id=\"headingLabel1\">Wonderful</div>\n    <div id=\"headingLabel2\">Fantastic</div>\n\n    <div id=\"headingShadowHost\"/>\n  </div>\n\n    <script/>\n\n  <input id=\"input\"/>\n    <optgroup>\n      <option id=\"first\">First option</option>\n      <option id=\"second\">Second option</option>\n    </optgroup>\n\n  <script/>\n\n  <div id=\"fromDiv\"/>\n\n  <script/>\n\n  <div id=\"originalDocumentDiv\"/>\n\n  <script/>\n\n  <!-- TODO(chrishall): add additional GC test covering:\n       if an element is in an invalid scope but attached to the document, it's\n       not GC'd;\n  -->\n\n  <!-- TODO(chrishall): add additional GC test covering:\n       if an element is not attached to the document, but is in a tree fragment\n       which is not GC'd because there is a script reference to another element\n       in the tree fragment, and the relationship is valid because it is between\n       two elements in that tree fragment, the relationship is exposed *and* the\n       element is not GC'd\n  -->\n\n</body></html>"
const document = loadDOM(html, `text/html`)

  test(function(t) {
    assert_equals(activedescendant.ariaActiveDescendantElement, null,
                  "invalid ID for relationship returns null");

    // Element reference should be set if the content attribute was included.
    assert_equals(parentListbox.getAttribute("aria-activedescendant"), "i1", "check content attribute after parsing.");
    assert_equals(parentListbox.ariaActiveDescendantElement, i1, "check idl attribute after parsing.");

    // If we set the content attribute, the element reference should reflect this.
    parentListbox.setAttribute("aria-activedescendant", "i2");
    assert_equals(parentListbox.ariaActiveDescendantElement, i2, "setting the content attribute updates the element reference.");

    // Setting the element reference should be reflected in the content attribute.
    parentListbox.ariaActiveDescendantElement = i1;
    assert_equals(parentListbox.ariaActiveDescendantElement, i1, "getter should return the right element reference.");
    assert_equals(parentListbox.getAttribute("aria-activedescendant"), "i1", "content attribute should reflect the element reference.");

    // Both content and IDL attribute should be nullable.
    parentListbox.ariaActiveDescendantElement = null;
    assert_equals(parentListbox.ariaActiveDescendantElement, null);
    assert_false(parentListbox.hasAttribute("aria-activedescendant"));
    assert_equals(parentListbox.getAttribute("aria-activedescendant"), null, "nullifying the idl attribute removes the content attribute.");

    // Setting content attribute to non-existent or non compatible element should nullify the IDL attribute.
    // Reset the element to an existant one.
    parentListbox.setAttribute("aria-activedescendant", "i1");
    assert_equals(parentListbox.ariaActiveDescendantElement, i1, "reset attribute.");

    parentListbox.setAttribute("aria-activedescendant", "non-existent-element");
    assert_equals(parentListbox.getAttribute("aria-activedescendant"), "non-existent-element");
    assert_equals(parentListbox.ariaActiveDescendantElement, null,"non-DOM content attribute should null the element reference");
  }, "aria-activedescendant element reflection");
  

  test(function(t) {
    const option1 = document.getElementById("option1");
    const option2 = document.getElementById("option2");
    assert_equals(parentListbox2.ariaActiveDescendantElement, option1);
    option1.removeAttribute("id");
    option2.setAttribute("id", "option1");
    const option2Duplicate = document.getElementById("option1");
    assert_equals(option2, option2Duplicate);

    assert_equals(parentListbox2.ariaActiveDescendantElement, option2);
  }, "If the content attribute is set directly, the IDL attribute getter always returns the first element whose ID matches the content attribute.");
  

  test(function(t) {
    // Get second child of parent. This violates the setting of a reflected element
    // as it will not be the first child of the parent with that ID, which should
    // result in an empty string for the content attribute.
    blankIdParent.ariaActiveDescendantElement = blankIdParent.children[1];
    assert_true(blankIdParent.hasAttribute("aria-activedescendant"));
    assert_equals(blankIdParent.getAttribute("aria-activedescendant"), "");
    assert_equals(blankIdParent.ariaActiveDescendantElement, blankIdParent.children[1]);
  }, "Setting the IDL attribute to an element which is not the first element in DOM order with its ID causes the content attribute to be an empty string");
  

  test(function(t) {
    const shadow = shadowHost.attachShadow({mode: "open"});
    const link = document.createElement("a");
    shadow.appendChild(link);

    assert_equals(lightParagraph.ariaActiveDescendantElement, null);

    // The given element crosses a shadow dom boundary, so it cannot be
    // set as an element reference.
    lightParagraph.ariaActiveDescendantElement = link;
    assert_equals(lightParagraph.ariaActiveDescendantElement, null);

    // The given element crosses a shadow dom boundary (upwards), so
    // can be used as an element reference, but the content attribute
    // should reflect the empty string.
    link.ariaActiveDescendantElement = lightParagraph;
    assert_equals(link.ariaActiveDescendantElement, lightParagraph);
    assert_equals(link.getAttribute("aria-activedescendant"), "");
  }, "Setting an element reference that crosses into a shadow tree is disallowed, but setting one that is in a shadow inclusive ancestor is allowed.");
  

  test(function(t) {
    startTime.ariaErrorMessageElement = errorMessage;
    assert_equals(startTime.getAttribute("aria-errormessage"), "errorMessage");

    startTime.ariaErrorMessageElement = null;
    assert_equals(startTime.ariaErrorMessageElement, null, "blah");
    assert_false(startTime.hasAttribute("aria-errormessage"));

    startTime.setAttribute("aria-errormessage", "errorMessage");
    assert_equals(startTime.ariaErrorMessageElement, errorMessage);

  }, "aria-errormessage");

  


  test(function(t) {
    assert_array_equals(passwordField.ariaDetailsElements, []);
    passwordField.ariaDetailsElements = [ listItem1 ];
    assert_equals(passwordField.getAttribute("aria-details"), "listItem1");

    passwordField.ariaDetailsElements = [ listItem2 ];
    assert_equals(passwordField.getAttribute("aria-details"), "listItem2");
  }, "aria-details");
  


  test(function(t) {
    const idlAttrElement = document.getElementById("idlAttrElement");

    assert_equals(deletionParent.getAttribute("aria-activedescendant"), "contentAttrElement");
    assert_equals(deletionParent.ariaActiveDescendantElement, contentAttrElement);

    // Deleting an element set via the content attribute.
    deletionParent.removeChild(contentAttrElement);
    assert_equals(deletionParent.getAttribute("aria-activedescendant"), "contentAttrElement");

    // As it was not explitly set, the attr-associated-element is computed from the content attribute,
    // and since descendant1 has been removed from the DOM, it is not valid.
    assert_equals(deletionParent.ariaActiveDescendantElement, null);

    // Deleting an element set via the IDL attribute.
    deletionParent.ariaActiveDescendantElement = idlAttrElement;
    assert_equals(deletionParent.getAttribute("aria-activedescendant"), "idlAttrElement");

    deletionParent.removeChild(idlAttrElement);
    assert_equals(deletionParent.ariaActiveDescendantElement, null);

    // The content attribute will still reflect the id.
    assert_equals(deletionParent.getAttribute("aria-activedescendant"), "idlAttrElement");
  }, "Deleting a reflected element should return null for the IDL attribute and cause the content attribute to become stale.");
  

  test(function(t) {
    const changingIdElement = document.getElementById("changingIdElement");
    assert_equals(parentNode.ariaActiveDescendantElement, changingIdElement);

    // Modify the id attribute.
    changingIdElement.setAttribute("id", "new-id");

    // The content attribute still reflects the old id, and we expect the
    // Element reference to be null as there is no DOM node with id "original"
    assert_equals(parentNode.getAttribute("aria-activedescendant"), "changingIdElement");
    assert_equals(parentNode.ariaActiveDescendantElement, null, "Element set via content attribute with a changed id will return null on getting");

    parentNode.ariaActiveDescendantElement = changingIdElement;
    assert_equals(parentNode.getAttribute("aria-activedescendant"), "new-id");

    // The explicitly set element takes precendance over the content attribute.
    // This means that we still return the same element reference, but the
    // content attribute reflects the old id.
    changingIdElement.setAttribute("id", "newer-id");
    assert_equals(parentNode.ariaActiveDescendantElement, changingIdElement, "explicitly set element is still present even after the id has been changed");
    assert_equals(parentNode.getAttribute("aria-activedescendant"), "new-id", "content attribute reflects the id that was present upon explicitly setting the element reference.");
  }, "Changing the ID of an element causes the content attribute to become out of sync.");
  

  test(function(t) {
    const lightElement = document.getElementById("lightElement");
    const shadowRoot = shadowHostElement.attachShadow({mode: "open"});

    assert_equals(lightParent.ariaActiveDescendantElement, null, 'null before');
    assert_equals(lightParent.getAttribute('aria-activedescendant'), null, 'null before');

    lightParent.ariaActiveDescendantElement = lightElement;
    assert_equals(lightParent.ariaActiveDescendantElement, lightElement);
    assert_equals(lightParent.getAttribute('aria-activedescendant'), "lightElement");

    // Move the referenced element into shadow DOM.
    // This will cause the computed attr-associated element to be null as the
    // referenced element will no longer be in a valid scope.
    // The underlying reference is kept intact, so if the referenced element is
    // later restored to a valid scope the computed attr-associated element will
    // then reflect
    shadowRoot.appendChild(lightElement);
    assert_equals(lightParent.ariaActiveDescendantElement, null, "computed attr-assoc element should be null as referenced element is in an invalid scope");
    assert_equals(lightParent.getAttribute("aria-activedescendant"), "lightElement");

    // Move the referenced element back into light DOM.
    // Since the underlying reference was kept intact, after moving the
    // referenced element back to a valid scope should be reflected in the
    // computed attr-associated element.
    lightParent.appendChild(lightElement);
    assert_equals(lightParent.ariaActiveDescendantElement, lightElement, "computed attr-assoc element should be restored as referenced element is back in a valid scope");
    assert_equals(lightParent.getAttribute("aria-activedescendant"), "lightElement");
  }, "Reparenting an element into a descendant shadow scope hides the element reference.");
  

  test(function(t) {
    const shadowRoot = shadowFridge.attachShadow({mode: "open"});
    const banana = document.getElementById("banana");

    fruitbowl.ariaActiveDescendantElement = apple;
    assert_equals(fruitbowl.ariaActiveDescendantElement, apple);
    assert_equals(fruitbowl.getAttribute("aria-activedescendant"), "apple");

    // Move the referenced element into shadow DOM.
    shadowRoot.appendChild(apple);
    assert_equals(fruitbowl.ariaActiveDescendantElement, null, "computed attr-assoc element should be null as referenced element is in an invalid scope");
    // Note that the content attribute is NOT cleared.
    assert_equals(fruitbowl.getAttribute("aria-activedescendant"), "apple");

    // let us rename our banana to an apple
    banana.setAttribute("id", "apple");
    const lyingBanana = document.getElementById("apple");
    assert_equals(lyingBanana, banana);

    // our ariaActiveDescendantElement thankfully isn't tricked.
    // this is thanks to the underlying reference being kept intact, it is
    // checked and found to be in an invalid scope and therefore the content
    // attribute fallback isn't used.
    assert_equals(fruitbowl.ariaActiveDescendantElement, null);
    // our content attribute still returns "apple",
    // even though fetching that by id would give us our lying banana.
    assert_equals(fruitbowl.getAttribute("aria-activedescendant"), "apple");

    // when we remove our IDL attribute, the content attribute is also thankfully cleared.
    fruitbowl.ariaActiveDescendantElement = null;
    assert_equals(fruitbowl.ariaActiveDescendantElement, null);
    assert_equals(fruitbowl.getAttribute("aria-activedescendant"), null);
  }, "Reparenting referenced element cannot cause retargeting of reference.");
  

  test(function(t) {
    const shadowRoot = shadowPantry.attachShadow({mode: "open"});

    // Our toast starts in the shadowPantry.
    const toast = document.createElement("div");
    toast.setAttribute("id", "toast");
    shadowRoot.appendChild(toast);

    // Prepare my toast for toasting
    toaster.ariaActiveDescendantElement = toast;
    assert_equals(toaster.ariaActiveDescendantElement, null);
    assert_equals(toaster.getAttribute("aria-activedescendant"), "");

    // Time to make some toast
    toaster.appendChild(toast);
    assert_equals(toaster.ariaActiveDescendantElement, toast);
    // Current spec behaviour:
    assert_equals(toaster.getAttribute("aria-activedescendant"), "");
  }, "Element reference set in invalid scope remains intact throughout move to valid scope.");
  

  test(function(t) {
    const billingElement = document.getElementById("billingElement")
    assert_array_equals(input1.ariaLabelledByElements, [billingElement, nameElement], "parsed content attribute sets element references.");
    assert_equals(input2.ariaLabelledByElements, null, "Testing missing content attribute after parsing.");

    input2.ariaLabelledByElements = [billingElement, addressElement];
    assert_array_equals(input2.ariaLabelledByElements, [billingElement, addressElement], "Testing IDL setter/getter.");
    assert_equals(input2.getAttribute("aria-labelledby"), "billingElement addressElement");

    // Remove the billingElement from the DOM.
    // As it was explicitly set the underlying association will remain intact,
    // but it will be hidden until the element is moved back into a valid scope.
    billingElement.remove();
    assert_array_equals(input2.ariaLabelledByElements, [addressElement], "Computed ariaLabelledByElements shouldn't include billing when out of scope.");

    // Insert the billingElement back into the DOM and check that it is visible
    // again, as the underlying association should have been kept intact.
    billingElementContainer.appendChild(billingElement);
    assert_array_equals(input2.ariaLabelledByElements, [billingElement, addressElement], "Billing element back in scope.");

    input2.ariaLabelledByElements = [];
    assert_array_equals(input2.ariaLabelledByElements, [], "Testing IDL setter/getter for empty array.");
    assert_equals(input2.getAttribute("aria-labelledby"), "");

    input1.removeAttribute("aria-labelledby");
    assert_equals(input1.ariaLabelledByElements, null);

    input1.setAttribute("aria-labelledby", "nameElement addressElement");
    assert_array_equals(input1.ariaLabelledByElements, [nameElement, addressElement],
      "computed value after setting attribute directly");

    input1.ariaLabelledByElements = null;
    assert_false(input1.hasAttribute("aria-labelledby", "Nullifying the IDL attribute should remove the content attribute."));
  }, "aria-labelledby.");
  

  test(function(t) {
    assert_array_equals(link1.ariaControlsElements, [panel1]);
    assert_equals(link2.ariaControlsElements, null);

    link2.setAttribute("aria-controls", "panel1 panel2");
    assert_array_equals(link2.ariaControlsElements, [panel1, panel2]);

    link1.ariaControlsElements = [];
    assert_equals(link1.getAttribute("aria-controls"), "");

    link2.ariaControlsElements = [panel1, panel2];
    assert_equals(link2.getAttribute("aria-controls"), "panel1 panel2");

    link2.removeAttribute("aria-controls");
    assert_equals(link2.ariaControlsElements, null);

    link2.ariaControlsElements = [panel1, panel2];
    assert_equals(link2.getAttribute("aria-controls"), "panel1 panel2");

    link2.ariaControlsElements = null;
    assert_false(link2.hasAttribute("aria-controls", "Nullifying the IDL attribute should remove the content attribute."));
  }, "aria-controls.");
  

  test(function(t) {
    assert_array_equals(describedLink.ariaDescribedByElements, [description1, description2]);

    describedLink.ariaDescribedByElements = [description1, description2];
    assert_equals(describedLink.getAttribute("aria-describedby"), "description1 description2");

    describedLink.ariaDescribedByElements = [];
    assert_equals(describedLink.getAttribute("aria-describedby"), "");

    describedLink.setAttribute("aria-describedby", "description1");
    assert_array_equals(describedLink.ariaDescribedByElements, [description1]);

    describedLink.removeAttribute("aria-describedby");
    assert_equals(describedLink.ariaDescribedByElements, null);

    describedLink.ariaDescribedByElements = [description1, description2];
    assert_equals(describedLink.getAttribute("aria-describedby"), "description1 description2");

    describedLink.ariaDescribedByElements = null;
    assert_false(describedLink.hasAttribute("aria-describedby", "Nullifying the IDL attribute should remove the content attribute."));
  }, "aria-describedby.");
  

  test(function(t) {
    const article1 = document.getElementById("article1");
    const article2 = document.getElementById("article2");

    assert_array_equals(titleHeading.ariaFlowToElements, [article1, article2]);

    titleHeading.ariaFlowToElements = [article1, article2];
    assert_equals(titleHeading.getAttribute("aria-flowto"), "article1 article2");

    titleHeading.ariaFlowToElements = [];
    assert_equals(titleHeading.getAttribute("aria-flowto"), "");

    titleHeading.setAttribute("aria-flowto", "article1");
    assert_array_equals(titleHeading.ariaFlowToElements, [article1]);

    titleHeading.removeAttribute("aria-flowto");
    assert_equals(titleHeading.ariaFlowToElements, null);

    titleHeading.ariaFlowToElements = [article1, article2];
    assert_equals(titleHeading.getAttribute("aria-flowto"), "article1 article2");

    titleHeading.ariaFlowToElements = null;
    assert_false(titleHeading.hasAttribute("aria-flowto", "Nullifying the IDL attribute should remove the content attribute."));
  }, "aria-flowto.");
  

  test(function(t) {
    assert_array_equals(listItemOwner.ariaOwnsElements, [child1, child2]);

    listItemOwner.removeAttribute("aria-owns");
    assert_equals(listItemOwner.ariaOwnsElements, null);

    listItemOwner.ariaOwnsElements = [child1, child2];
    assert_equals(listItemOwner.getAttribute("aria-owns"), "child1 child2");

    listItemOwner.ariaOwnsElements = [];
    assert_equals(listItemOwner.getAttribute("aria-owns"), "");

    listItemOwner.setAttribute("aria-owns", "child1");
    assert_array_equals(listItemOwner.ariaOwnsElements, [child1]);

    listItemOwner.ariaOwnsElements = [child1, child2];
    assert_equals(listItemOwner.getAttribute("aria-owns"), "child1 child2");

    listItemOwner.ariaOwnsElements = null;
    assert_false(listItemOwner.hasAttribute("aria-owns", "Nullifying the IDL attribute should remove the content attribute."));
  }, "aria-owns.");
  

  test(function(t) {
    const shadowRoot = host.attachShadow({mode: "open"});
    const shadowChild1 = document.createElement("article");
    shadowChild1.setAttribute("id", "shadowChild1");
    shadowRoot.appendChild(shadowChild1);
    const shadowChild2 = document.createElement("article");
    shadowChild2.setAttribute("id", "shadowChild1");
    shadowRoot.appendChild(shadowChild2);

    // The elements in the content attribute are in a "darker" tree - they
    // enter a shadow encapsulation boundary, so not be associated any more.
    assert_array_equals(lightDomHeading.ariaFlowToElements, []);

    // These elements are in a shadow including ancestor, i.e "lighter" tree.
    // Valid for the IDL attribute, but content attribute should be null.
    shadowChild1.ariaFlowToElements = [lightDomText1, lightDomText2];
    assert_equals(shadowChild1.getAttribute("aria-flowto"), "", "empty content attribute for elements that cross shadow boundaries.");

    // These IDs belong to a different scope, so the attr-associated-element
    // cannot be computed.
    shadowChild2.setAttribute("aria-flowto", "lightDomText1 lightDomText2");
    assert_array_equals(shadowChild2.ariaFlowToElements, []);

    // Elements that cross into shadow DOM are dropped, only reflect the valid
    // elements in IDL and in the content attribute.
    lightDomHeading.ariaFlowToElements = [shadowChild1, shadowChild2, lightDomText1, lightDomText2];
    assert_array_equals(lightDomHeading.ariaFlowToElements, [lightDomText1, lightDomText2], "IDL should only include valid elements");
    assert_equals(lightDomHeading.getAttribute("aria-flowto"), "", "empty content attribute if any given elements cross shadow boundaries");

    // Using a mixture of elements in the same scope and in a shadow including
    // ancestor should set the IDL attribute, but should reflect the empty
    // string in the content attribute.
    shadowChild1.removeAttribute("aria-flowto");
    shadowChild1.ariaFlowToElements = [shadowChild1, lightDomText1];
    assert_equals(shadowChild1.getAttribute("aria-flowto"), "", "Setting IDL elements with a mix of scopes should reflect an empty string in the content attribute")

  }, "shadow DOM behaviour for FrozenArray element reflection.");
  

  test(function(t) {
    const description1 = document.getElementById("buttonDescription1");
    const description2 = document.getElementById("buttonDescription2");
    const outerShadowRoot = outerShadowHost.attachShadow({mode: "open"});
    const innerShadowHost = document.createElement("div");
    outerShadowRoot.appendChild(innerShadowHost);
    const innerShadowRoot = innerShadowHost.attachShadow({mode: "open"});

    // Create an element, add some attr associated light DOM elements and append it to the outer shadow root.
    const describedElement = document.createElement("button");
    describedButtonContainer.appendChild(describedElement);
    describedElement.ariaDescribedByElements = [description1, description2];

    // All elements were in the same scope, so elements are gettable and the content attribute reflects the ids.
    assert_array_equals(describedElement.ariaDescribedByElements, [description1, description2], "same scope reference");
    assert_equals(describedElement.getAttribute("aria-describedby"), "buttonDescription1 buttonDescription2");

    outerShadowRoot.appendChild(describedElement);

    // Explicitly set attr-associated-elements should still be gettable because we are referencing elements in a lighter scope.
    // The content attr still reflects the ids from the explicit elements because they were in a valid scope at the time of setting.
    assert_array_equals(describedElement.ariaDescribedByElements, [description1, description2], "lighter scope reference");
    assert_equals(describedElement.getAttribute("aria-describedby"), "buttonDescription1 buttonDescription2");

    // Move the explicitly set elements into a deeper shadow DOM to test the relationship should not be gettable.
    innerShadowRoot.appendChild(description1);
    innerShadowRoot.appendChild(description2);

    // Explicitly set elements are no longer retrievable, because they are no longer in a valid scope.
    assert_array_equals(describedElement.ariaDescribedByElements, [], "invalid scope reference");
    assert_equals(describedElement.getAttribute("aria-describedby"), "buttonDescription1 buttonDescription2");

    // Move into the same shadow scope as the explicitly set elements to test that the elements are gettable
    // and reflect the correct IDs onto the content attribute.
    innerShadowRoot.appendChild(describedElement);
    assert_array_equals(describedElement.ariaDescribedByElements, [description1, description2], "restored valid scope reference");
    assert_equals(describedElement.getAttribute("aria-describedby"), "buttonDescription1 buttonDescription2");
  }, "Moving explicitly set elements across shadow DOM boundaries.");
  

    test(function(t) {
      const shadowRoot = headingShadowHost.attachShadow({mode: "open"});
      const headingElement = document.createElement("h1");
      const headingLabel1 = document.getElementById("headingLabel1")
      const headingLabel2 = document.getElementById("headingLabel2")
      shadowRoot.appendChild(headingElement);

      assert_array_equals(labeledby.ariaLabelledByElements, [headingLabel1, headingLabel2], "aria-labeled by is supported by IDL getter.");

      // Explicitly set elements are in a lighter shadow DOM, so that's ok.
      headingElement.ariaLabelledByElements = [headingLabel1, headingLabel2];
      assert_array_equals(headingElement.ariaLabelledByElements, [headingLabel1, headingLabel2], "Lighter elements are gettable when explicitly set.");
      assert_equals(headingElement.getAttribute("aria-labelledby"), "", "Crosses shadow DOM boundary, so content attribute should be empty string.");

      // Move into Light DOM, explicitly set elements should still be gettable.
      // Note that the content attribute still reflects the element ids - when scope changes it becomes stale.
      sameScopeContainer.appendChild(headingElement);
      assert_array_equals(headingElement.ariaLabelledByElements, [headingLabel1, headingLabel2], "Elements are all in same scope, so gettable.");
      assert_equals(headingElement.getAttribute("aria-labelledby"), "", "Content attribute is empty, as on setting the explicitly set elements they were in a different scope.");

      // Reset the association, to update the content attribute.
      headingElement.ariaLabelledByElements = [headingLabel1, headingLabel2];
      assert_equals(headingElement.getAttribute("aria-labelledby"), "headingLabel1 headingLabel2", "Elements are set again, so the content attribute is updated.");

      // Remove the referring element from the DOM, elements are no longer longer exposed,
      // underlying internal reference is still kept intact.
      headingElement.remove();
      assert_array_equals(headingElement.ariaLabelledByElements, [], "Element is no longer in the document, so references should no longer be exposed.");
      assert_equals(headingElement.getAttribute("aria-labelledby"), "headingLabel1 headingLabel2");

      // Insert it back in.
      sameScopeContainer.appendChild(headingElement);
      assert_array_equals(headingElement.ariaLabelledByElements, [headingLabel1, headingLabel2], "Element is restored to valid scope, so should be gettable.");
      assert_equals(headingElement.getAttribute("aria-labelledby"), "headingLabel1 headingLabel2");

      // Remove everything from the DOM, nothing is exposed again.
      headingLabel1.remove();
      headingLabel2.remove();
      assert_array_equals(headingElement.ariaLabelledByElements, []);
      assert_equals(headingElement.getAttribute("aria-labelledby"), "headingLabel1 headingLabel2");
      assert_equals(document.getElementById("headingLabel1"), null);
      assert_equals(document.getElementById("headingLabel2"), null);

      // Reset the association to update the content attribute.
      headingElement.ariaLabelledByElements = [headingLabel1, headingLabel2];
      assert_array_equals(headingElement.ariaLabelledByElements, []);
      assert_equals(headingElement.getAttribute("aria-labelledby"), "");
    }, "Moving explicitly set elements around within the same scope, and removing from the DOM.");
    

    test(function(t) {
      input.ariaActiveDescendantElement = first;
      first.parentElement.appendChild(first);

      assert_equals(input.ariaActiveDescendantElement, first);
    }, "Reparenting.");
  

    test(function(t) {
      const toSpan = document.createElement('span');
      toSpan.setAttribute("id", "toSpan");
      fromDiv.ariaActiveDescendantElement = toSpan;

      assert_equals(fromDiv.ariaActiveDescendantElement, null, "Referenced element not inserted into document, so is in an invalid scope.");
      assert_equals(fromDiv.getAttribute("aria-activedescendant"), "", "Invalid scope, so content attribute not set.");

      fromDiv.appendChild(toSpan);
      assert_equals(fromDiv.ariaActiveDescendantElement, toSpan, "Referenced element now inserted into the document.");
      assert_equals(fromDiv.getAttribute("aria-activedescendant"), "", "Content attribute remains empty, as it is only updated at set time.");

    }, "Attaching element reference before it's inserted into the DOM.");
  

    test(function(t) {
      const newDoc = document.implementation.createHTMLDocument('new document');
      const newDocSpan = newDoc.createElement('span');
      newDoc.body.appendChild(newDocSpan);

      // Create a reference across documents.
      originalDocumentDiv.ariaActiveDescendantElement = newDocSpan;

      assert_equals(originalDocumentDiv.ariaActiveDescendantElement, null, "Cross-document is an invalid scope, so reference will not be visible.");
      assert_equals(fromDiv.getAttribute("aria-activedescendant"), "", "Invalid scope when set, so content attribute not set.");

      // "Move" span to first document.
      originalDocumentDiv.appendChild(newDocSpan);

      // Implementation defined: moving object into same document from other document may cause reference to become visible.
      assert_equals(originalDocumentDiv.ariaActiveDescendantElement, newDocSpan, "Implementation defined: moving object back *may* make reference visible.");
      assert_equals(fromDiv.getAttribute("aria-activedescendant"), "", "Invalid scope when set, so content attribute not set.");
    }, "Cross-document references and moves.");
  