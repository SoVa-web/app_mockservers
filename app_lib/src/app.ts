import Creator from './creator.ts'
import ReadWriter from './reader_openapi.ts'

let port = Number(process.argv[2])
let path_openapi = process.argv[3]//"./testopenapi3_1.yaml"
let name_project = process.argv[4]//"test_001"
let timeout = Number(process.argv[5])

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
        let reader = new ReadWriter(this.path_openapi, this.name_project)
        reader.read_openapi().then(()=>{
            this.creator = new Creator(this.port, this.name_project, this.delay, reader)//створення mock-сервісу відбувається в останню чергу
            this.creator.create()
            console.log("Created mock service by path " +  this.creator.path_file_script)
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



