// export const NEXT = Symbol("next");
// export const PREV = Symbol("prev");
// export const START = Symbol("start");
// export const END = Symbol("end");

// class Node {
// 	[NEXT]?: Node;
// 	[PREV]?: Node;
// 	// nodeType() {
// 	// 	return 0;
// 	// }
// 	// constructor(next?: Node, prev?: Node) {
// 	// 	if (next) this[NEXT] = next;
// 	// 	if (prev) this[PREV] = prev;
// 	// }
// 	// namespaceURI?: string;
// 	// prefix?: string;
// 	// ownerDocument?: Document;
// }

// export class End extends Node {
// 	[START]?: Parent;
// 	// constructor(next?: Node, prev?: Node, start?: Parent) {
// 	// 	super();
// 	// 	if (next) this[NEXT] = next;
// 	// 	if (prev) this[PREV] = prev;
// 	// 	if (start) this[START] = start;
// 	// }
// 	static ofParent(node: Parent) {
// 		const end = new End();
// 		end[PREV] = node;
// 		end[START] = node;
// 		return end;
// 	}
// }

// export class Parent extends Node {
// 	[END]?: End;
// 	constructor() {
// 		super();
// 		this[END] = this[NEXT] = End.ofParent(this);
// 	}
// }

// export class Child extends Node {
// 	constructor() {
// 		super();
// 	}
// }

// export interface INode<T> {
// 	[NEXT]?: T;
// 	[PREV]?: T;
// }
// // export interface IChild extends INode {}
// export interface IEnd<T, P extends T> extends INode<T> {
// 	[START]: P;
// }
// export interface IParent<T, P extends T> extends INode<T> {
// 	[END]: IEnd<T, P>;
// }

// export const getEnd = function <T, P extends T>(node: INode<T>) {
// 	return node instanceof P ? node[END] : node;
// };

// export const nextSibling = function <T> (node: INode<T>) {
// 	const end = getEnd(node);
// 	if (end) {
// 		const next = end[NEXT];
// 		return next && (next instanceof End ? null : next);
// 	}
// };

// /*

// class C {
//     testr(){
//         return "testr";
//     }
// }
// class D {
//     testr(){
//         return "123";
//     }
// }
// class A<C> extends C {
//   hello(){
//       return "hello" + this.testr()    ;
//   }
// }
// class B extends A<C> {

//   hi(){
//       return "hi";
//   }
// }


// const x = new B();
// console.log("test", x.hi(), x.hello(), x.testr())
// */