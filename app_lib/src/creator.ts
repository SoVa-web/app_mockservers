import { writeFile } from "node:fs/promises"
import { exec, ChildProcess} from 'child_process';
import Reader from "./reader_openapi";

export interface Object_RunningMockservice{
    name: string
    child_mockservice: ChildProcess
}

class Creator{
    path_project:string
    port:number
    path_file_script: string;
    methods_script:string = ``
    reader:Reader
    arr_child_process:Array<Object_RunningMockservice> = []

    constructor(port:number, path_project:string, reader:Reader){
        this.path_project = path_project
        this.port = port
        this.path_file_script = `${this.path_project}mockservice_port_${this.port}.ts`
        this.reader = reader
    }

    public create(){
        let imports = `
        import express from 'express'
        import reader from './reader_openapi'
        import Logging from './logging'
        `

        let app = `
        const app = express()
        let log = new Logging("${this.path_project}mockservice_port_${this.port}_log.log")
        `

        let script_mockservice:string = imports + app + this.add_method("get", "/" ) + this.add_script_start(this.port)
        writeFile(this.path_file_script, script_mockservice)
    }

    run(name_mockservice:string):void{
        let child_server = exec(`node --loader ts-node/esm ${this.path_file_script}`);

        child_server.on('exit',(status)=>{
            console.log(`Процес завершився з кодом виходу: ${status}`);
        })

        this.arr_child_process.push({
            name: name_mockservice,
            child_mockservice: child_server
        })
    }

    stop(name_mockservice:string):void{ //new ver
        this.arr_child_process.forEach(item => {
            if(item.name = name_mockservice){
                item.child_mockservice.kill()
            }
        })
    }

    add_methods(endpoint_list:Array<any>):void{
        let parameters:Array<object> = []
        endpoint_list.forEach(endpoint_method => {
            parameters = this.reader.parsing_parameters(endpoint_method.method, endpoint_method.endpoint)
            if(parameters.length === 0){
                this.methods_script += this.add_method(endpoint_method.method, endpoint_method.endpoint)
            }else{
                this.methods_script += this.add_method(endpoint_method.method, endpoint_method.endpoint, parameters)
            }
        })
    }

    add_method(method_req:string, endpoint:string, parameters:Array<object>|null = null):string{
        let script = ``
        switch(method_req){
            case "get":
                script = this.add_method_get(endpoint, parameters)
                break;
            case "post":
                break;
            default:
        }
        return script
    }

    add_method_get(endpoint: string, parameters:object|null):string {
        let data:object = {}
        let temp:string = ``

        if (parameters != null){

        }else{
            data = {test: "Наче працює"} //сюди витягуємо дані з мок-даних
            temp = `app.get('${endpoint}', (req, res) => {\n\t\tres.send(${JSON.stringify(data)});\n\t});\n\n`
        }
        
        return temp
    }

    add_script_start(port:number):string{
        let start = `app.listen(${port}, () => {\n\t\tconsole.log("Server is starting on ${port}")\n\t})`
        return start
    }
}

export default Creator

