% :- use_module(library(dcgs)).

push(V, L0, L1) :- [V | L0] = L1.

tree_flat_rec(l, ACC, ACC).
tree_flat_rec(n(L,V,R), ACC, OUT) :-  
    tree_flat_rec(R, ACC, RO), 
    push(V,      RO,  RO_),
    tree_flat_rec(L, RO_, OUT).


tree_flat_dcg(l)     --> [] .
tree_flat_(n(L,V,R)) -->  
    tree_flat_dcg(R), 
    push(V),
    tree_flat_dcg(L).


% as mutually recursive loop/tailcalls
loop_tree_flat(l       , ACC, CONT, OUT) :- apply_cont(CONT, ACC, OUT).
loop_tree_flat(n(L,V,R), ACC, CONT, OUT) :- loop_tree_flat(R, ACC, do_left(L,V, CONT), OUT).

apply_cont(done, DONE, DONE).
apply_cont(do_left(LEFT, VAL, CONT_), ARG, OUT) :-
        push(VAL, ARG, ACC),
        loop_tree_flat(LEFT, ACC, CONT_, OUT).


% as state machine
tree_flat(T,OUT) :- tree_flat_run(loop(T,[],done),OUT).
tree_flat_run(STATE, OUT) :- 
    tree_flat_trans(STATE, NEXT),
    (   NEXT = return(RET) -> OUT = RET
    ; 
        tree_flat_run(NEXT, OUT) 
    ).
tree_flat_trans(loop(l       , ACC, CONT            ), apply(CONT, ACC)                ).
tree_flat_trans(loop(n(L,V,R), ACC, CONT            ), loop(R, ACC, do_left(L,V, CONT))).
tree_flat_trans(apply(done                     , OUT), return(OUT)                     ).
tree_flat_trans(apply(do_left(LEFT, VAL, CONT_), ARG), loop(LEFT, [VAL | ARG], CONT_)  ).
