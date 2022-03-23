import * as all from "../../dist/all.js";
for (const [k, v] of Object.entries(all)) {
  global[k] = v;
}
import "../wpthelp.mjs"
const html = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" id=\"svg-root\" width=\"100%\" height=\"100%\" viewBox=\"0 0 480 360\">\n  <!--======================================================================-->\n  <!--=  Copyright 2008 World Wide Web Consortium, (Massachusetts          =-->\n  <!--=  Institute of Technology, European Research Consortium for         =-->\n  <!--=  Informatics and Mathematics (ERCIM), Keio University).            =-->\n  <!--=  All Rights Reserved.                                              =-->\n  <!--=  See http://www.w3.org/Consortium/Legal/.                          =-->\n  <!--======================================================================-->\n  <d:SVGTestCase xmlns:d=\"http://www.w3.org/2000/02/svg/testsuite/description/\" template-version=\"1.4\" reviewer=\"CM\" author=\"ED\" status=\"accepted\" version=\"$Revision: 1.9 $\" testname=\"$RCSfile: coords-dom-02-f.svg,v $\">\n    <d:testDescription xmlns=\"http://www.w3.org/1999/xhtml\" href=\"http://www.w3.org/TR/SVG11/coords.html#InterfaceSVGTransform\">\n        <p>\n          Tests the liveness of SVGTransform.matrix, that the SVGTransform object is updated when the SVGTransform.matrix object is changed.\n        </p>\n    </d:testDescription>\n    <d:operatorScript xmlns=\"http://www.w3.org/1999/xhtml\">\n      <p>\n        Run the test. No interaction required.\n      </p>\n    </d:operatorScript>\n    <d:passCriteria xmlns=\"http://www.w3.org/1999/xhtml\">\n      <p>\n        The test has passed if:\n      </p>\n      <ul>\n        <li>There is no red visible</li>\n        <li>There is a green ellipse visible</li>\n      </ul>\n    </d:passCriteria>\n  </d:SVGTestCase>\n  <title id=\"test-title\">$RCSfile: coords-dom-02-f.svg,v $</title>\n  <defs>\n    <font-face font-family=\"SVGFreeSansASCII\" unicode-range=\"U+0-7F\">\n      <font-face-src>\n        <font-face-uri xlink:href=\"../resources/SVGFreeSans.svg#ascii\"/>\n      </font-face-src>\n    </font-face>\n  </defs>\n  <g id=\"test-body-content\" font-family=\"SVGFreeSansASCII,sans-serif\" font-size=\"18\">\n\n    <g transform=\"translate(220 160)\">\n      <g id=\"reference\">\n        <circle r=\"41\" fill=\"red\" transform=\"translate(20 20) scale(2 1)\"/>\n      </g>\n\n      <g id=\"g\" transform=\"translate(20 20)\">\n        <circle id=\"c\" r=\"41\" fill=\"blue\"/>\n      </g>\n    </g>\n\n    <script type=\"text/ecmascript\"/>\n\n  </g>\n  <g font-family=\"SVGFreeSansASCII,sans-serif\" font-size=\"32\">\n  <text id=\"revision\" x=\"10\" y=\"340\" stroke=\"none\" fill=\"black\">$Revision: 1.9 $</text>\n  </g>\n  <rect xml:id=\"test-frame\" x=\"1\" y=\"1\" width=\"478\" height=\"358\" fill=\"none\" stroke=\"#000\"/>\n  <!-- comment out this watermark once the test is approved --><!--\n  <g id=\"draft-watermark\">\n    <rect x=\"1\" y=\"1\" width=\"478\" height=\"20\" fill=\"red\" stroke=\"black\" stroke-width=\"1\"/>\n    <text font-family=\"SVGFreeSansASCII,sans-serif\" font-weight=\"bold\" font-size=\"20\" x=\"240\"\n      text-anchor=\"middle\" y=\"18\" stroke-width=\"0.5\" stroke=\"black\" fill=\"white\">DRAFT</text>\n  </g>-->\n</svg>"
const document = loadDOM(html, `application/xml`)

      var passed = false;

      try
      {
        var g = document.getElementById("g");
        var c = document.getElementById("c");
        var tfm = g.transform.baseVal.getItem(0);
        var mtx = tfm.matrix;
        mtx.a = 2;
        if(tfm.type == SVGTransform.SVG_TRANSFORM_MATRIX)
        {
          passed = true;
        }
      }
      catch(e) {}

      if(passed)
      {
        c.setAttribute("fill", "lime");
      }
      else
      {
        c.setAttribute("fill", "red");
      }
    