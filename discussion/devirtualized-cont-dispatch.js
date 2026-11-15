/**
 * Tree type definitions
 *
 * @typedef {0} Leaf_Tag
 * @typedef {1} Node_Tag
 *
 * @typedef {{tag: Leaf_Tag}} Leaf
 *
 * @typedef {{
 *     tag: Node_Tag,
 *     v: number,
 *     l: Bin_Tree,
 *     r: Bin_Tree
 * }} Node
 *
 * @typedef {Leaf | Node} Bin_Tree
 */

/** 
 * continuation type definitions
 * 
 * a continuation is represented as:
 * [function_reference, environment_object]
 * 
 * @typedef {(c_data:object, arg: number[])=> number[]} Cont_Function
 * @typedef {[Cont_Function, object]} Cont
 * 
 * @typedef {{
 *     v:number,
 *     r:Bin_Tree,
 *     cont:Cont
 * }}  Do_Right_Data
 * 
 */

/**  
 *  @type {{L:Leaf_Tag} & {N: Node_Tag}}
 */

const Tree_Tag = Object.freeze({
    L: 0,
    N: 1,
});

// tree constructors

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

// ================================================
// Continuation functions
// ================================================

/**
 * Terminal continuation
 *
 * @param {object} c_data
 * @param {number[]} arg
 * @returns {number[]}
 */
function done(c_data, arg) {
    return arg;
}

/**
 * Right-subtree continuation
 *
 * @param {object} c_data
 * @param {number[]} left
 * @returns {number[]}
 */
function do_right_continuation(c_data, left) {

    /** @type {Do_Right_Data} */
    const data = /** @type {Do_Right_Data} */ (c_data);

    left.push(data.v);

    return flatten_cps_named(
        data.r,
        left,
        data.cont
    );
}

// ================================================
// Continuation factories
// ================================================

/**
 * Creates the terminal continuation.
 *
 * @returns {Cont}
 */
function dont_cont() {
    return [done, {}];
}


/**
 * Creates a right-subtree continuation record.
 *
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

// devirtualization cont dispatcher

/** 
 * @param {Cont} c
 * @param {number[]} arg
 * @returns {number[]}
  */

function apply_(c, arg) {
    if (c[0] === do_right_continuation) {
        return do_right_continuation(
            c[1],
            arg
        );
    } else if (c[0] === done) {
        return done(
            c[1],
            arg
        );
    }
}


// ================================================
// Named CPS core function
// ================================================

/**
 * @param {Bin_Tree} t
 * @param {number[]} acc
 * @param {Cont} cont
 * @returns {number[]}
 */
function flatten_cps_named(t, acc, cont) {

    switch (t.tag) {

        case Tree_Tag.L:

            // Base case: invoke the devirtualized dispatcher.
            return apply_(cont, acc);


        case Tree_Tag.N:

            // Recursive case: create a named continuation
            // and pass it to the left subtree.
            return flatten_cps_named(
                t.l,
                acc,
                flatten_cps_named_do_right(
                    t.v,
                    t.r,
                    cont
                )
            );
    }
}


// ================================================
// Entry point
// ================================================

/**
 * @param {Bin_Tree} t
 * @param {number[]} acc
 * @returns {number[]}
 */
function flatten_cps_named_call(t, acc) {

    return flatten_cps_named(
        t,
        acc,
        dont_cont()
    );
}

// ================================================
// Test tree
// ================================================

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


// ================================================
// Execute
// ================================================

const result = flatten_cps_named_call(tree, []);

console.log("Flattened: [" + result.join(",") + "]");