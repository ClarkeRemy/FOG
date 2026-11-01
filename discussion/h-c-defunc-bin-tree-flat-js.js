//Tree - the enum and factory functions
const Tree = Object.freeze({
    L: 0,
    N: 1,
});

function makeLeaf() {
    return { tag: Tree.L };
}

function makeNode(l, v, r) {
    return { tag: Tree.N, l: l, v: v, r: r };
}


// CONT - continuation enum and factory functions
const CONT = Object.freeze({
    DONE: 0,
    DoRight: 1,
});

// factory function make done
function makeDone() {
    return { tag: CONT.DONE };
}

//factory for the "DoRight" continuation
function makeDoRight(v, r, cont) {
    return { tag: CONT.DoRight, v: v, r: r, cont: cont };
}

//apply - interprets a continuation
function apply(c, arg) {
    switch (c.tag) {
        case CONT.DONE:
            return arg;

        case CONT.DoRight:
            let left = arg;
            left.push(c.v);
            return flatten_defunc(c.r, left, c.cont);
    }
}

//flatten_defunc - the defunctionalized flatten
function flatten_defunc(t, acc, cont) {
    switch (t.tag) {
        case Tree.L:
            return apply(cont, acc);

        case Tree.N:
            return flatten_defunc(
                t.l,
                acc,
                makeDoRight(t.v, t.r, cont)
            );
    }
}

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

const result = flatten_defunc(tree, [], makeDone());
console.log("Flattened: [" + result.join(", ") + "]");