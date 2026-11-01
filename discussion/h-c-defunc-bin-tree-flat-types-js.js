/**
 * 
 * @typedef {0}                 leaf_tag
 * @typedef {1}                 node_tag
 * @typedef {{ tag:leaf_tag }}  Leaf
 * @typedef {{ tag : node_tag, 
 *             v   : number,
 *             l   : BinTree,
 *             r   : BinTree }} Node
 * @typedef {Leaf | Node}       BinTree
 * 
 * @typedef {0}                 done_tag
 * @typedef {1}                 doright_tag
 * @typedef {{ tag:done_tag }}  done
 * @typedef {{ tag:doright_tag,
 *              v:number,
 *              r:BinTree,
 *              cont:cont    }} doright
 * @typedef {done | doright}    cont
 * 
 */

/** 
 *  @type {{L:leaf_tag} & {N:node_tag}}
 * */
const Tree_Tag = Object.freeze({
    L: 0,
    N: 1,
});

/**
 * 
 * @returns {Leaf} n m
 */

function makeLeaf() {
    return { tag: Tree_Tag.L };
}

/**
 * @param {BinTree} l
 * @param {number} v 
 * @param {BinTree} r
 * @returns {Node} 
 */
function makeNode(l, v, r) {
    return { tag: Tree_Tag.N, l: l, v: v, r: r };
}


// Cont_tag - continuation enum and factory functions

/** 
 *  @type {{DONE:done_tag} & {DoRight:doright_tag}}
 * */
const Cont_tag = Object.freeze({
    DONE: 0,
    DoRight: 1,
});

/**
 * @returns {done} 
 */
// factory function make done
function makeDone() {
    return { tag: Cont_tag.DONE };
}

/**
 * @param {number} v
 * @param {BinTree} r
 * @param {cont} cont
 * @returns {doright} 
 */
//factory for the "DoRight" continuation
function makeDoRight(v, r, cont) {
    return { tag: Cont_tag.DoRight, v: v, r: r, cont: cont };
}

/**
 * @param {cont} c
 * @returns {(arg:number[]) => number[]} 
 */

//apply - interprets a continuation
function apply(c) {
    return function (arg) {
        switch (c.tag) {
            case Cont_tag.DONE:
                return arg;

            case Cont_tag.DoRight:
                let left = arg;
                left.push(c.v);
                return flatten_defunc(c.r, left, c.cont);
        }
    }
} 

//flatten_defunc - the defunctionalized flatten
/**
 
 * @param {BinTree } t 
 * @param {number[]} acc 
 * @param {cont} cont 
 * @returns {number[]} 
 */

function flatten_defunc(t, acc, cont) {
    switch (t.tag) {
        case Tree_Tag.L:
            return (apply(cont))(acc);

        case Tree_Tag.N:
            return flatten_defunc(
                t.l,
                acc,
                makeDoRight(t.v, t.r, cont)  // 
            );
    }
}


// function flatten_defunc(t, acc, cont) {
//     while (true) {
//         switch (t.tag) {
//             case Tree_Tag.L:
//                 return (apply(cont))(acc);

//             case Tree_Tag.N:
//                 cont = makeDoRight(t.v, t.r, cont); // 
//                 acc = acc;
//                 t = t.l;
//                 break;
//         }
//     }
// }


//current flatten_defunc(tag:1, v:2, r:node3, cont:{tag:1, v:4, r:6, cont:{tag:0}})
//

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
