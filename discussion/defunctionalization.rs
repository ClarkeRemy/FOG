#[derive(Debug)]
enum Tree{
    L,
    N(Box<Tree>, i32, Box<Tree>)
}


fn flatten(t : Tree, acc: Vec<i32>) -> Vec<i32> {
    match t {
        Tree::L => acc,
        Tree::N(l,v,r) => {
            let mut left = flatten(*l, acc);
            left.push(v);
            flatten(*r, left)
        }
    }
}

fn flatten_cps_call(t : Tree, acc: Vec<i32>) -> Vec<i32> {
    flatten_cps(t, acc, Box::new(|x|x))
}
fn flatten_cps(
    t : Tree,
    acc: Vec<i32>, 
    cont : Box<dyn FnOnce(Vec<i32>)->Vec<i32>>
) -> Vec<i32> {
    match t {
        Tree::L => cont(acc),
        Tree::N(l,v,r) => {
            flatten_cps(
                *l,
                acc,
                Box::new(move |mut left|{
                    left.push(v);
                    flatten_cps(*r, left, cont)
                })
            )
        }
    }
}


type Cont_ = Box<dyn FnOnce(Vec<i32>)->Vec<i32>>;

fn flatten_cps_named_call(t : Tree, acc: Vec<i32>) -> Vec<i32> {
    flatten_cps_named(t, acc, flatten_cps_named_done())
}
fn flatten_cps_named(
    t : Tree,
    acc: Vec<i32>, 
    cont : Cont_
) -> Vec<i32> {
    match t {
        Tree::L => cont(acc),
        Tree::N(l,v,r) => {
            flatten_cps_named(
                *l,
                acc,
                flatten_cps_named_do_right((v,r,cont))
            )
        }
    }
}

fn flatten_cps_named_done() -> Cont_ {
    Box::new(|x|x)
}
fn flatten_cps_named_do_right((v,r,cont): (i32, Box<Tree>, Cont_)) -> Cont_ {
        Box::new(move |mut left|{
            left.push(v);
            flatten_cps_named(*r, left, cont)
        })
}




enum Cont {
    Done,
    DoRight((i32, Box<Tree>, Box<Cont>))
}
fn flatten_defunc_call(t : Tree, acc: Vec<i32>) -> Vec<i32> {
    flatten_defunc(t, acc, Cont::Done)
}
fn flatten_defunc(t : Tree, acc: Vec<i32>, cont : Cont) -> Vec<i32> {
    match t {
        Tree::L => apply(cont,acc),
        Tree::N(l,v,r) => {
            flatten_defunc(
                *l,
                acc,
                Cont::DoRight((v,r,Box::new(cont)))
            )
        }
    }
}
fn apply(c : Cont, arg : Vec<i32> )->Vec<i32> {
    match c {
        Cont::Done       => arg,
        Cont::DoRight((v,r,cont)) => {
            let mut left = arg;
            left.push(v);
            flatten_defunc(*r, left, *cont)
        },
    }
}






enum State {
    Loop((Tree, Vec<i32>, Cont)),
    Apply((Cont, Vec<i32>)),
    Complete(Vec<i32>),
}
fn init_state(t : Tree, acc: Vec<i32>) -> State {
    State::Loop((t,acc,Cont::Done))
}
fn next_state(s : State) -> State {
    match s {
        State::Loop((t,acc,cont)) => match t {
        Tree::L => State::Apply((cont,acc)),
        Tree::N(l,v,r) =>
            State::Loop((
                *l,
                acc,
                Cont::DoRight((v,r,Box::new(cont)))
            ))
        },
        State::Apply((c,arg)) => match c {
            Cont::Done       => State::Complete(arg),
            Cont::DoRight((v,r,cont)) => {
                    let mut left = arg;
                    left.push(v);
                    State::Loop((*r, left, *cont))
                },
        },
        c @ State::Complete(_) => c,
    }
}

fn main() {
    println!("Hello, world!");
}
