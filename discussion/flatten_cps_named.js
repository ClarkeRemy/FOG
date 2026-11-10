/**  
 * @typedef {0} Leaf_Tag
 * @typedef {1} Node_Tag
 * @typedef {{tag: Leaf_Tag}} Leaf
 * @typedef {{tag: Node_Tag,
 *            v:   number,
 *            l:   Bin_Tree,
 *            r:   Bin_Tree}} Node 
 * @typedef {Leaf | Node} Bin_Tree
 * 
 * @typedef {(arg: number[])=>number[]} Cont
*/

/**  
 * @type {{L:Leaf_Tag} & {N:Node_Tag}}
 */
const Tree_Tag = Object.freeze({
    L: 0,
    N: 1,
});

/**  
 * @returns {Leaf}
 */
function makeLeaf() {
    return { tag: Tree_Tag.L };
}

/**  
 * @param {Bin_Tree} l
 * @param {number} v 
 * @param {Bin_Tree} r
 * @returns {Node}
 */
function makeNode(l, v, r) {
    return { tag: Tree_Tag.N, l: l, v: v, r: r };
}

//Named CPS Factories

function flatten_cps_named_done() {
    /** 
     * @param {number[]} x
     * @returns {number[]}
     */

    function identity(x) {
        return x;
    }
    return identity;
}

/** 
 * @param {number} v 
 * @param {Bin_Tree} r
 * @param {Cont} cont
 * @returns {Cont}
 */

function flatten_cps_named_do_right(v, r, cont) {  // this function captures v, r, cont (id), a new cont
    /** 
     * @param {number[]} left
     * @returns {number[]}
     */
    function do_right_continuation(left) {
        left.push(v);
        return flatten_cps_named(r, left, cont);
    }
    return do_right_continuation;
}

// name cps core function

/**  
 * @param {Bin_Tree} t
 * @param {number[]} acc 
 * @param {Cont} cont 
 * @returns {number[]}
 */

function flatten_cps_named(t, acc, cont) {
    switch (t.tag) {
        case Tree_Tag.L:
            //base case: call the cont with the acc
            return cont(acc);

        case Tree_Tag.N:
            //recursive case: create a named cont and pass to left child
            return flatten_cps_named(
                t.l,
                acc,
                flatten_cps_named_do_right(t.v, t.r, cont)
            );
    }
}

// entry point

/** 
 * Entry point for Named CPS
 * @param {Bin_Tree} t 
 * @param {number[]} acc 
 * @returns {number[]}
 */

function flatten_cps_named_call(t, acc) {
    return flatten_cps_named(t, acc, flatten_cps_named_done());
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

const result = flatten_cps_named_call(tree, []);
console.log("Flattened: [" + result.join(", ") + "]");