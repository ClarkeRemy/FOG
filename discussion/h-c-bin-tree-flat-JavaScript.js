// tree enum
const Tree = Object.freeze({
    L: 0,
    N: 1,
});

// factory functions
function makeLeaf() {
    return { tag: Tree.L };
}

function makeNode(l, v, r) {
    return { tag: Tree.N, l: l, v: v, r: r };
}

// main flat func
function flatten(t, acc) {
    switch (t.tag) {
        case Tree.L:
            return acc;

        case Tree.N:
            let left = flatten(t.l, acc);
            left.push(t.v);
            return flatten(t.r, left);
    }
}

// bin tree
const tree = makeNode(
    makeNode(
        makeNode(makeLeaf(), 1, makeLeaf()),
        2,
        makeNode(makeLeaf(), 3, makeLeaf())
    ),
    4,
    makeNode(
        makeNode(makeLeaf(), 5, makeLeaf()),
        6,
        makeNode(makeLeaf(), 7, makeLeaf())
    )
);

const result = flatten(tree, []);
console.log("Flattened: [" + result.join(", ") + "]");