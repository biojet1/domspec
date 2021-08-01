from xml.dom.minidom import parse, parseString
from lxml import etree


from lxml.etree import ElementTree

from sys import stdout, stderr
from io import BytesIO
from re import compile as regex
from itertools import combinations, product, permutations

x = ["Tag", "Text", "Tag:A", "Tag:B", "Comment"]

atts = ["Attr", "Attr:A", "Attr:B"]


def gen(l):
    for n in range(len(l)):
        yield list(combinations(l, n + 1))


def comb(l):
    for i, v in enumerate(l):
        l1 = tuple([v])
        yield l1
        lv = list(l)
        lv.pop(i)
        for n in range(len(lv)):
            for c in combinations(lv, n + 1):
                yield l1 + c


def comb1(l):
    for n in range(len(l)):
        for c in combinations(l, n + 1):
            yield c
def perm1(l):
    for n in range(len(l)):
        for c in permutations(l, n + 1):
            yield c

# for a in comb(atts):
#     for b in a:
#         print(b)
# for a in set(comb(atts)):
#     print(a)

def kv(l):
    yield []
    for v in comb1(l):
        yield [(f"{{{k}}}name", "value") if k else ("name", "value") for k in v]

def genxml(ns):
    # print(list(dict(v) for v in kv(l)))
    def plain(e):
        return e
    def text(e):
        return e
    def tail(e):
        return e

    for v in kv(ns):
        a = etree.Element("a", attrib=dict(v))
        yield a

        # yield a

# x = ["Tag", "Text", "Tag:A", "Tag:B", "Comment"]
# ElementTree.Comment

    # l = ["", "apple", "banana"]
NS = {"A": "apple", "B": "banana"}
NSV = tuple(NS.values()) + ('',)

root = etree.Element("xml", nsmap=NS)
for e in genxml(NSV):
    root.append(e)
etree.dump(root)

x = ["Tag", "Text", "Attr", "End", "Comment", "Tag:A", "Tag:B", "Attr:A", "Attr:B"]

print(list(perm1(NSV)))
