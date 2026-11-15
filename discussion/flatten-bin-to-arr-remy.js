function done(c_data, arg) { return arg }

function do_right_continuation(c_data, left) {
    left.push(c_data.v);
    return flatten_cps_named(c_data.r, left, c_data.cont);
}

function dont_cont() { return [done, {}] }
function flatten_cps_named_do_right(v, r, cont) {
    return [do_right_continuation, { v: v, r: r, cont: cont }];
}

function apply(c, arg) { return c[0](c[1], arg) }

function apply_(c, arg) {
    if c[0] === do_right_continuation {
        return do_right_continuation(c[1], arg)
    } else if c[0] === done {
        return done(c[1], arg)
    }
}

function apply__(c, arg) {
    if c[0] === do_right_continuation {
        c_data = c[1];
        left = arg;
        left.push(c_data.v);
        return flatten_cps_named(c_data.r, left, c_data.cont);
    } else if c[0] === done {
        return arg
    }
}



function flatten_cps_named(t, acc, cont) {
    switch (t.tag) {
        case Tree_Tag.L:
            //base case: call the cont with the acc
            return apply(cont, acc);

        case Tree_Tag.N:
            //recursive case: create a named cont and pass to left child
            return flatten_cps_named(
                t.l,
                acc,
                flatten_cps_named_do_right(t.v, t.r, cont)
            );
    }
}