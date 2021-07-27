from xml.dom.minidom import parse, parseString
from lxml import etree
# from lxml.etree.ElementTree import ElementTree
from sys import stdout, stderr
from io import BytesIO
from re import compile as regex

x = ["Tag", "Text", "Attr", "End", "Comment"]


def gen():
    c = None
    for a in x:
        for b in reversed(x):
            # if b == "Attr":
            #     if a == "Attr":
            #         pass
            #     elif a == "Tag":
            #         pass
            #     else:
            #         continue
            if a == "Text" and b == "Text":
                continue
            if a == "End":
                if b == "Attr":
                    continue
            elif a in ("Comment", "Text"):
                if b == "Attr":
                    continue
            elif c == "End":
                if a == "Attr":
                    yield "Tag"
            elif c in ("Comment", "Text"):
                if a == "Attr":
                    yield "Tag"
            yield a
            yield b
            c = b


# def flatten(g):
#     for a in g:
#         for b in a:
#             yield b
# 无人爱苦，亦无人寻之欲之，乃因其苦
lorem = r"""
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
""".split()


l = list(gen())


def fix(l):
    lor = iter(set(lorem))
    p = []
    t = 0
    on = None
    for i, v in enumerate(l):
        if v == "Tag":
            k = next(lor).strip(",").strip(".")
            p.append(k)
            l[i] = f"{on and '>' or ''}<{k}"
            on = True
        elif v == "Attr":
            assert(on is True)
            l[i] = f''' {next(lor).strip(',').strip('.')}="{next(lor)}"'''
        elif v == "Comment":
            l[i] = f"{on and '>' or ''}<!--{next(lor)}-->"
            on = False
        elif v == "Text":
            l[i] = f"{on and '>' or ''}{next(lor)}"
            on = False
        elif v == "End":
            k = p.pop()
            l[i] = f"{on and '>' or ''}</{k}>"
            on = False
        else:
            assert 0
    while p:
        k = p.pop()
        if on:
            on = False
            l.append(f"></{k}>")
        else:
            l.append(f"</{k}>")

    # for i, v in enumerate(l):
    #     if v.startswith("</"):
    #         prev = l[i-1]
    #         print(prev, f'{v[0:1]}/{v[2:]}', file=stderr)
    #         if prev == f'{v[0:1]}/{v[2:]}':
    #             l[i-1:i+1] = f'{prev[0:-2]}/{prev[-1:]}'


fix(l)

tree = etree.ElementTree()

xml = "".join(l)

empty = regex(r"<(\w+)></\1>")
even = 0
def rep(m):
    global even
    even += 1
    if even % 2 == 0:
        return f"<{m.group(1)}/>"
    return m.group(0)
    # print(m.group(0), even % 2, file=stderr)

xml = empty.sub(rep, xml)

print(xml, file=stderr)
tree.parse(BytesIO(xml.encode("UTF-8")))
tree.write(stdout.buffer, method="c14n" )
# etree.tostring(root
# dom = parseString(xml)
# print(dom.toxml())
