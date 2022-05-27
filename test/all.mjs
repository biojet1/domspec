import * as all from '../dist/all.js';
// import * as all from '../dist/document.js';
// import * as all from '../dist/child-node.js';
// import * as all from '../dist/parent-node.js';
// "./parent-node.js"
console.log(Object.keys(all).filter(k=>!/^(HTML|SVG|CSS|XML)/.test(k)).sort());
// console.info((Object.keys(dom).filter(k=>!/^(HTML|SVG)/.test(k)).join(' ')));
// import * as mod from 'anim8-ts';

