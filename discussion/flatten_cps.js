/**   
 * @typedef {0} Leaf_Tag
 * @typedef {1} Node_Tag
 * @typedef {{tag:Leaf_Tag}} Leaf
 * @typedef {{tag:Node_Tag,
 *            v  :number,
 *            l  :Bin_Tree,
 *            r  : Bin_Tree}} Node 
 * @typedef {leaf | Node} Bin_Tree
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
 * @returns {node}
 */
function makeNode(l, v, r) {
    return { tag: Tree_Tag.N, l: l, v: v, r: r };
}

// cps with closures (flatten_cps)

/**  
 * @param {Bin_Tree} t
 * @param {number[]} acc
 * @param {(arg:number[])=> number[]} cont
 * @returns {number[]}
*/

function flatten_cps(t, acc, cont) {
    switch (t.tag) {
        case Tree_Tag.L:
            //Base case: call the continuation with the accumulator
            return cont(acc);   k2, k3, k4

        case Tree_Tag.N:
            //Recursive case: create a new closure and pass it to the left child
            return flatten_cps(
                t.l,
                acc,
                /**  
                 * @param {number[]} left
                 * @returns {number[]}
                 */
                function (left) {   
                    left.push(t.v);   // [1,2]
                    return flatten_cps(t.r, left, cont);
                }                          //[1,2]   k4
            );
    }
}

/**   
 *@param {Bin_Tree} t
 *@param {number[]} acc
 *@returns {number[]}
 */

function flatten_cps_call(t, acc) {
    //Pass the identity function as the initial continuation
    /**  
     * @param {number[]} x
     * @returns {number[]}
     */
    function identity(x) {
        return x;
    }

    return flatten_cps(t, acc, identity);
}

//Tree
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

//main
const result = flatten_cps_call(tree, []);
console.log("Flattened: [" + result.join(", ") + "]");


