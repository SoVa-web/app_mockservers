import Creator from './creator.ts'
import ReadWriter from './reader_openapi.ts'
import Logging from "./logging"

let port = 5500||80
let path_openapi = "./test_data_openapi3.yaml"
let path_project = `../data/`

let reader = new ReadWriter(path_openapi)
reader.read_openapi().then(()=>{
    console.log(reader.parsing_endpoints())
})

class API_LIB{
    create(port:number, path_openapi:string, path_project:string, delay:number):void{
        let reader = new ReadWriter(path_openapi)
        reader.read_openapi().then(()=>{
            let creator = new Creator(port, path_project, reader)//створення mock-сервісу відбувається в останню чергу
            creator.create()
            creator.run("test_001")
        })
    }

    run(port:number, path_openapi:string, path_project:string, delay:number):void{
        let reader = new ReadWriter(path_openapi)
    }

    show_log():string{
        return ""
    }
}

export default API_LIB



