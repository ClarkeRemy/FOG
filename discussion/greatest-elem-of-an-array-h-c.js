// edge case
function assert(condition) {  // this receives a boolean
    if (!condition) {
        throw new Error("Assertion failed");
    }
}

//PC 
const PC = Object.freeze({
    BEGIN_LOOP: 0,
    END_LOOP: 1,
});

// State Machine
function makeMachine() {
    return {
        IDX: 0,
        THEMAX: 0,
        VALUES: null,
        COUNT: 0,
        pc: PC.BEGIN_LOOP,
    };
}

// MAX_ELEM_INIT
function MAX_ELEM_INIT(count, values) {
    const m = makeMachine();

    assert(count > 0);

    m.IDX = 1;
    m.THEMAX = values[0];
    m.VALUES = values;
    m.COUNT = count;
    m.pc = PC.BEGIN_LOOP;

    return m;
}

// RESPONSE_TAG
const RESPONSE_TAG = Object.freeze({
    UNINIT: 0,
    RUNNING: 1,
    DONE: 2,
});

//RESPONSE tagged Union
function makeUNINITResponse() {

    return {
        tag: RESPONSE_TAG.UNINIT, // this decides which payload is active, initialially set to uninit
        done: { max: 0 }, // done is the payload, {max: 0} an object with one field, max, set to 0 
        running: {},
    };
}

//STATE_MAX_ACT
function STATE_MAX_ACT(m, r) {


    // for (let running = true; running;) {
    switch (m.pc) {

        //Edge Case
        case PC.BEGIN_LOOP:
            if (!(m.IDX < m.COUNT)) {
                r.tag = RESPONSE_TAG.RUNNING; // tell the env/driver "call me again" to return the result, since the PC has set to end_loop so will return the result in the next call
                m.pc = PC.END_LOOP;
                //Begin loop runs the loop, End Loop returns the result.
                break; // exit the switch structure
            }

            m.THEMAX = m.VALUES[m.IDX] > m.THEMAX ? m.VALUES[m.IDX] : m.THEMAX;
            ++(m.IDX);

            r.tag = RESPONSE_TAG.RUNNING;
            // running = false;
            break;

        case PC.END_LOOP:
            r.tag = RESPONSE_TAG.DONE;
            r.done.max = m.THEMAX;
            // running = false;
            break;
    }
    // }

    return r;
}

//Driver
function maxDriven(count, values) {
    const m = MAX_ELEM_INIT(count, values);

    let r = makeUNINITResponse();
    do {
        STATE_MAX_ACT(m, r);
    } while (r.tag === RESPONSE_TAG.RUNNING);

    return r.done.max;
}

//INPUTS,
const arr = [3.0, 1.0, 4.0, 1.0, 5.0, 9.0, 2.0, 6.0];
const n = arr.length;

const result = maxDriven(n, arr);
console.log("Max = " + result);
