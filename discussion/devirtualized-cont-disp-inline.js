/** 
 * tree type definitions
 * 
 * @typedef {0} Leaf_Tag
 * @typedef {1} Node_Tag
 * 
 * @typedef {{tag:Leaf_Tag}} Leaf
 * 
 * @typedef {{
 *      tag:Node_Tag,
 *      v: number,
 *      l:Bin_Tree,
 *      r:Bin_Tree
 * }} Node
 * 
 * @typedef {Leaf | Node} Bin_Tree
 */

/** 
 * Continuation type definitions
 * 
 * A continuation is represendted as:
 * [function_reference, environment_object]
 * 
 * @typedef {(c_data: object, arg: number[])=>number[]} Cont_Function
 * @typedef {[Cont_Function,object]} Cont
 * 
 * @typedef {{
 *      v:number,
 *      r:Bin_Tree,
 *      cont: Cont
 * }} Do_Right_Data
 */

/** 
 * @type {{L: Leaf_Tag} & {N: Node_Tag}}
  */
const Tree_Tag = Object.freeze({
    L: 0,
    N: 1
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
    return {
        tag: Tree_Tag.N,
        l: l,
        v: v,
        r: r
    };
}

// Continuation functions

/** 
 * @param {object} c_data
 * @param {number[]} arg
 * @returns {number[]} 
 */

function done(c_data, arg) {
    return arg;
}

/** 
 * @param {object} c_data
 * @param {number[]} left
 * @returns {number[]}
  */

function do_right_continuation(c_data, left) {
    /** @type {Do_Right_Data} */
    const data = /** @type {Do_Right_Data} */ (c_data);

    left.push(data.v);
    return flatten_cps_named(data.r, left, data.cont);
}

/** 
 * Continuation factories
 */

/**
 * @returns {Cont}
 */
function dont_cont() {
    return [done, {}];
}

/** 
 * @param {number} v
 * @param {Bin_Tree} r
 * @param {Cont} cont
 * @returns {Cont} 
 */
function flatten_cps_named_do_right(v, r, cont) {
    return [
        do_right_continuation,
        {
            v: v,
            r: r,
            cont: cont
        }
    ];
}

/** 
 * Devirtualized continuation dispatcher with inlining
 * 
 * @param {Cont} c
 * @param {number[]} arg
 * @returns {number[]}
 */

function apply__(c, arg) {
    if (c[0] === do_right_continuation) {
        /** @type {Do_Right_Data} */
        const c_data = /** @type {Do_Right_Data} */ (c[1]);

        const left = arg;

        left.push(c_data.v);

        return flatten_cps_named(c_data.r, left, c_data.cont);

    } else if (c[0] === done) {
        return arg;
    }
}

/** 
 * Main CPS function
 * 
 * @param {Bin_Tree} t
 * @param {number[]} acc
 * @param {Cont} cont
 * @returns {number[]}
  */

function flatten_cps_named(t, acc, cont) {
    switch (t.tag) {
        case Tree_Tag.L:
            // base case: call the continuation with the accumulator
            return apply__(cont, acc);

        case Tree_Tag.N:
            //Recursive case: create a named continuation
            //and pass it to the left child.
            return flatten_cps_named(
                t.l,
                acc,
                flatten_cps_named_do_right(t.v, t.r, cont)
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

/** 
 * Execute flattening.
 */

const result = flatten_cps_named(tree, [], dont_cont());

console.log("Flattened: [" + result.join(",") + "]");