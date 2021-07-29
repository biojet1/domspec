
const xhr = new XMLHttpRequest();

xhr.onload = function() {
  dump(xhr.responseXML.documentElement.nodeName);
}

xhr.onerror = function() {
  dump("Error while getting XML.");
}

xhr.open("GET", "test.xml");
xhr.responseType = "document";
xhr.send();



it("should add to numbers from an es module", () => {
  chai.assert.equal(3 + 5, 8);
});
for (const [x] in [1, 2, 3, 4]) {
  it("should add ", () => {
    chai.assert.equal(3, 8);
  });
}

