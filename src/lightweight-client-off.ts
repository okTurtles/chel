import process from 'node:process'

// chel is the server, so @chelonia/lib has to keep what it stores. Releases
// with okTurtles/libcheloniajs#104 default to a lightweight client that keeps
// nothing, and the library reads this once when it loads. main.ts imports this
// first, so it runs before anything loads the library. Always 'false',
// whatever the environment says: a server that keeps nothing is no use.
process.env.LIGHTWEIGHT_CLIENT = 'false'
