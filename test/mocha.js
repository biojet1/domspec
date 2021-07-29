const xhr = new XMLHttpRequest();

xhr.onload = function () {
  console.log(xhr.responseXML.documentElement.nodeName);
  for (const [x] in [1, 2, 3, 4]) {
    it("should add ", () => {
      chai.assert.equal(3, 8);
    });
  }
       mocha.run();
};

xhr.onerror = function () {
  console.log("Error while getting XML.");
};

xhr.open("GET", "test.xml");
xhr.responseType = "document";
xhr.send();

// it("should add to numbers from an es module", () => {
//   chai.assert.equal(3 + 5, 8);
// });
