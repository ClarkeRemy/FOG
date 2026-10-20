#include <stdio.h>
#include <limits.h>
#include <assert.h>

typedef enum
{
    BEGIN_LOOP,
    END_LOOP,
} PC;

typedef struct
{
    size_t IDX;
    float THEMAX;
    float *VALUES;
    unsigned int COUNT;
    PC pc;

} MACHINE;

MACHINE MAX_ELEM_INIT(unsigned int count, float values[])
// float max(unsigned int count, float values[])
{
    MACHINE m = {0};
    // {
    // assert(count > 0);
    assert(count > 0);
    // idx = 1; // from for loop
    m.IDX = 1;
    //     size_t idx;
    //     float themax = values[0];
    m.THEMAX = values[0];
    m.pc = BEGIN_LOOP;

    return m;
}

typedef enum
{
    UNINIT,
    RUNNING,
    DONE
} RESPONSE_TAG;

typedef struct
{
    RESPONSE_TAG tag;

    union // union is used to carry the payload
    {
        struct
        {
            float max;
        } done;

        struct
        {

        } running;
    };
} RESPONSE;

RESPONSE STATE_MAX_ACT(MACHINE *m)
{
    RESPONSE r = {0}; // RESPONSE r; do { r = STATE_MAX_ACT(&m); } while (r.tag == RUNNING);

    // m->pc == (*m).pc
    switch (m->pc)
    {
        break;

    case BEGIN_LOOP:
        //     for (; ; )
        //     {
        // if(!(idx < count))  break;
        if (!(m->IDX < m->COUNT))
        {
            m->pc = END_LOOP;
            r.tag = RUNNING; // tells the driver: "Don't stop yet — call me again."
            break;
        }

        //         themax = values[idx] > themax ? values[idx] : themax;
        m->THEMAX = m->VALUES[m->IDX] > m->THEMAX ? m->VALUES[m->IDX] : m->THEMAX;
        //         ++idx;
        ++(m->IDX);
        //     }

        // m->pc = END_LOOP;
        r.tag = RUNNING;

        break;

    case END_LOOP:

        r.tag = DONE;
        r.done.max = m->THEMAX;
        //     return themax;
    }
    return r;
}
