import Creator from './creator.ts'
import Reader from './reader_openapi.ts'
import Logging from "./logging"

let port = 5500||80
let path_openapi = "./testopenapi3_1.yaml"
let path_project = `./`

class API_LIB{
    create(port:number, path_openapi:string, path_project:string, delay:number):void{
        let reader = new Reader(path_openapi)
        reader.read_openapi().then(()=>{
            let creator = new Creator(port, path_project, reader)//створення mock-сервісу відбувається в останню чергу
            creator.create_mockservice()
            creator.run()
        })
    }

    run(port:number, path_openapi:string, path_project:string, delay:number):void{
        let reader = new Reader(path_openapi)
    }

    show_log():string{
        return ""
    }
}

export default API_LIB



