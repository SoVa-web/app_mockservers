import API_LIB from "./app.ts"


let port = Number(process.argv[2])
let path_openapi = process.argv[3]
let name_project = process.argv[4]
let timeout = Number(process.argv[5])

console.log(path_openapi)

API_LIB.create(port, path_openapi.replace(/\\/g, "/"), name_project, timeout, "terminal")