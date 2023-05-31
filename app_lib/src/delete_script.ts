import APP_LIB from "./app.ts";

let name:string = process.argv[2]

APP_LIB.delete(name)