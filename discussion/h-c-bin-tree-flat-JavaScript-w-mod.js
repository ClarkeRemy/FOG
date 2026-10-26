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
function flatten(t, acc, trace) {
    let trace_one = {
        // tag: "frame",
        node_type: t.tag,
        acc: acc,
        parent: trace
    }



    function print_trace(i, t) {
        let s = "";
        function indent() {
            for (let j = 0; j != i; j++) {
                s += "  ";
            }
        }

        if (Object.keys(t).length !== 0) {


            indent();
            s += `{ node_type: ${t.node_type}, \n`;
            indent();
            s += `  acc: ${t.acc}, \n`;
            indent();
            s += `  parent:  \n`;
            s += print_trace(i + 1, t.parent);
            indent();
            s += `} \n`;
            return s;
        }
        indent();
        s += "{} \n";
        return s;
    }


    let printed_result = print_trace(0, trace_one);

    console.log(printed_result);



    switch (t.tag) {
        case Tree.L:
            return acc;

        // case Tree.N:
        // let left = flatten(t.l, acc);
        // left.push(t.v);   
        // // let mid = push(t.v, left);   
        // return flatten(t.r, left);
        // // return flatten(t.r, mid);

        // flatten(t.l, acc);
        // acc.push(t.v);
        // flatten(t.r, acc);
        // return acc;

        case Tree.N:
            left.push(t.v);
            let left = flatten(t.l, acc, trace_one);
            // It always represent the value of parent node
            return flatten(t.r, left, trace_one);
    }
}


function countEvenNodes(t) {
    switch (t.tag) {
        case Tree.L:
            return 0;

        case Tree.N:
            return
            countEvenNodes(t.l) +
                ((t.v + 1) % 2) +
                countEvenNodes(t.r);
    }
}


// left - right - root



//    4
//    / \
//   2   6
//  / \ / \
// 1  3 5  7

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

const result = flatten(tree, [], {});
console.log("Flattened: [" + result.join(", ") + "]");