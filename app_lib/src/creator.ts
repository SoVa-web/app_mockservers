import { writeFile } from "node:fs/promises"
import { exec, ChildProcess} from 'child_process';
import Reader from "./reader_openapi";

export interface Object_RunningMockservice{
    name: string
    child_mockservice: ChildProcess
}

class Creator{
    name_project:string
    port:number
    path_file_script: string;
    timeout:number;
    methods_script:string = ``
    reader:Reader
    arr_child_process:Array<Object_RunningMockservice> = []

    constructor(port:number, name_project:string, timeout:number, reader:Reader){
        this.name_project = name_project
        this.port = port
        this.path_file_script = `../data/${this.name_project}_port_${this.port}.ts`
        this.reader = reader
        this.timeout = timeout
    }

    public create(){
        let imports = `import express from 'express'\nimport reader from '../src/reader_openapi'\nimport Logging from '../src/logging'\n`

        let app = `const app = express()\nlet log = new Logging("../log/${this.name_project}_port_${this.port}_log.log")\n`
        let endpoint_list = this.reader.parsing_endpoints()
        this.add_methods(endpoint_list)
        //console.log(endpoint_list)
        let script_mockservice:string = imports + app + this.methods_script + this.add_script_start(this.port)
        writeFile(this.path_file_script, script_mockservice)
    }

    run():void{
        let child_server = exec(`node --loader ts-node/esm ${this.path_file_script}`);

        child_server.on('exit',(status)=>{
            console.log(`Процес завершився з кодом виходу: ${status}`);
        })

        this.arr_child_process.push({
            name: this.name_project,
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
                this.methods_script += this.add_method(endpoint_method.method, endpoint_method.endpoint, endpoint_method.responses)
            }else{
                this.methods_script += this.add_method(endpoint_method.method, endpoint_method.endpoint, endpoint_method.responses, parameters)
            }
            console.log(this.methods_script)
        })
    }

    add_method(method_req:string, endpoint:string, status:Array<string>, parameters:Array<object>|null = null):string{
        let script = ``
        switch(method_req){
            case "get":
                console.log(status)
                script = this.add_method_get(endpoint, status, parameters)
                break;
            case "post":
                break;
            default:
                break;
        }
        //console.log(script)
        return script
    }

    add_method_get(endpoint: string, status:Array<string>, parameters:Array<object>|null):string {
        let data:object = {}// there will be mock-data from exsamples OpenAPI
        let temp:string = ``

        if (parameters != null){
            let body = ``
            temp = `app.get('${endpoint}', (req, res) => {\n\t\t${body}\n\t});\n\n`
        }else{
            console.log(status)
            data = this.reader.parsing_res_get(endpoint, random_status(status))
            temp = `app.get('${endpoint}', (req, res) => {\n\t\tsetTimeout(()=>{res.send(${JSON.stringify(data)})},${this.timeout});\n\t});\n\n`
        }

        function random_status(status_res:Array<string>):string{
            console.log(status_res)
            return status_res[(Math.floor(Math.random() * status_res.length))]
        }
        
        return temp
    }

    add_script_start(port:number):string{
        let start = `app.listen(${port}, () => {\n\t\tconsole.log("Server is starting on ${port}")\n\t})`
        return start
    }
}

export default Creator

