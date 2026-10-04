# FOG (First Order Generics)
## *Research into describing generic algorithms in a "First Order" way.*

A primary constraint is that we describe algorithms only in terms of 
information known at the time of definition of the algorithm.
This means we avoid parametric types, functions that are not known by 
definition and other mechanisms that delay instantiation of the 
implementation defining the algorithm.

Initial findings suggest that algorithms can be encoded as finite state transducers,
those transducers take outside information, and use that and the current state to derive
a next state and a command that the environment must run.
This means the algorithm is defined purely in terms of the behavior it has,
relative to the behavior it expects (in contrast to a results oriented system).

