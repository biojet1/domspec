from xml.dom.minidom import parse, parseString
from lxml import etree

# from lxml.etree.ElementTree import ElementTree
from sys import stdout, stderr
from io import BytesIO
from re import compile as regex
from itertools import combinations, product, permutations

y = x = ["Tag", "Text", "Attr", "End", "Comment", "Tag:A", "Tag:B", "Attr:A", "Attr:B"]

def perm1(l):
    for n in range(len(l)):
        for c in permutations(l, n + 1):
            yield c

def perm2(l):
    for i, v in enumerate(l):
        l2 = list(l)
        l2.pop(i)
        yield v

        for c in permutations(l, n + 1):
            yield c

x = ['A', 'B', 'C', 'D']
print(list(perm1(x)))


# print(list(permutations(y, 2)))
