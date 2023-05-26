import Creator from './creator.ts'
import ReadWriter from './reader_openapi.ts'
import Logging from "./logging"

let port = 5500||80
let path_openapi = "./testopenapi3_1.yaml"
let name_project = "test_001"
let timeout = 0

export class API_LIB{
    creator: Creator|undefined = undefined
    port: number
    path_openapi: string
    name_project: string
    delay: number

    constructor(port:number, path_openapi:string, name_project:string, delay:number){
        this.port = port
        this.path_openapi = path_openapi
        this.name_project = name_project
        this.delay = delay
    }


    create():void{
        let reader = new ReadWriter(this.path_openapi)
        reader.read_openapi().then(()=>{
            this.creator = new Creator(this.port, this.name_project, this.delay, reader)//створення mock-сервісу відбувається в останню чергу
            this.creator.create()
        })
    }

    run():void{
        if(this.creator) this.creator.run()
    }

    show_log():string{
        return ""
    }
}

let api = new API_LIB(port, path_openapi, name_project, timeout)
api.create()

export default API_LIB



