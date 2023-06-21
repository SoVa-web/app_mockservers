import { writeFile } from "node:fs/promises"
import Reader from "./reader_openapi";

export class Creator{
    private name_project:string
    private port:number
    public path_file_script: string
    public path_file_log: string
    private timeout:number
    private methods_script:string = ``
    private reader:Reader

    constructor(port:number, name_project:string, timeout:number, reader:Reader){
        this.name_project = name_project
        this.port = port
        this.path_file_script = `../data/${this.name_project}.ts`
        this.path_file_log  = `../log/${this.name_project}.log`
        this.reader = reader
        this.timeout = timeout
    }

    public create(){
        let imports = `import express from 'express'\nimport bodyParser from 'body-parser'\nimport Logging from '../src/logging.ts'\nimport filter from '../src/filter.ts'\nimport * as OpenApiValidator from 'express-openapi-validator'\n\n`
        let app = `const app = express()\napp.use(bodyParser.json())\napp.use(bodyParser.urlencoded({ extended: true }))\nlet log = new Logging("${this.path_file_log}")\n\n`
        let validator = `app.use(OpenApiValidator.middleware({\n\tapiSpec: path_openapi,\n\tvalidateRequests: true,\n\tvalidateResponses: true\n}))\napp.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.setHeader('Access-Control-Allow-Headers', '*')
            next();
          });\n`
        let name = `const name_project:string = "${this.name_project}"\n`
        let openapi = `const path_openapi:string = "${this.reader.path_openapi}"\n` 
        try{
            let endpoint_list = this.reader.parsing_endpoints()
            this.add_methods(endpoint_list)
            //console.log(endpoint_list)
            let script_mockservice:string = imports + name + openapi + app + validator + this.methods_script + this.add_script_start(this.port)
            writeFile(this.path_file_script, script_mockservice)
            writeFile(this.path_file_log, `Mock-service ${this.name_project} \n`)
        }catch(err){
            throw new Error("Error creating")
        }
    }

    private add_methods(endpoint_list:Array<any>):void{
        let parameters:Array<object> = []
        endpoint_list.forEach(endpoint_method => {
            parameters = this.reader.parsing_parameters(endpoint_method.method, endpoint_method.endpoint)
            if(parameters.length === 0 || !parameters){
                this.methods_script += this.add_method(endpoint_method.method, endpoint_method.endpoint, endpoint_method.responses)
            }else{
                this.methods_script += this.add_method(endpoint_method.method, endpoint_method.endpoint, endpoint_method.responses, parameters)
            }
            //console.log(this.methods_script)
        })
    }

    private add_method(method_req:string, endpoint:string, status:Array<string>, parameters:Array<object>|null = null):string{
        let script = ``

        switch(method_req){
            case "get":
                script = this.add_method_get(endpoint, status, parameters)
                break;
            case "post":
                script = this.add_method_post(endpoint, status)
                break;
            case "put":
                script = this.add_method_put(endpoint, status)
                break;
            case "delete":
                script = this.add_method_delete(endpoint, status)
                break;
            default:
                break;
        }
        //console.log(script)
        return script
    }

    private add_method_delete(endpoint: string, status: string[]): string {
        let data:object = {}
        if(status.includes("200")) data = this.reader.parsing_res(endpoint, "delete", "200")
        else if(status.includes("202")) data = this.reader.parsing_res(endpoint, "delete", "202")
        else if(status.includes("204")) data = this.reader.parsing_res(endpoint, "delete", "204")

        let data_str = `let data: any = ${JSON.stringify(data)}\n\t\t`//get mock-data

        let res = `setTimeout(()=>{res.send(JSON.stringify(data))},${this.timeout});\n\t\t`//response

        let log_req:string = `\n\t\tlog.add_log("Get request DELETE by ${endpoint}", String(JSON.stringify(req.body)))\n\t\t`
        let log_res:string = `log.add_log("Send response DELETE by ${endpoint}", data)\n\t\t`

        let body = log_req + data_str + log_res + res
        let temp:string = `app.delete('${endpoint.replace(new RegExp('{', 'g'), ':').replace(new RegExp('}', 'g'), '')}', (req, res) => {\n\t\tconsole.log("Get request DELETE on ${endpoint}")\n\t\t${body}\n\t});\n\n\n`
        return temp
    }

    private add_method_put(endpoint: string, status: string[]): string {
        let data:object = {}
        if(status.includes("200")) data = this.reader.parsing_res(endpoint, "put", "200")
        else if(status.includes("204")) data = this.reader.parsing_res(endpoint, "put", "204")

        let data_str = `let data: any = ${JSON.stringify(data)}\n\t\t`//get mock-data

        let res = `setTimeout(()=>{res.send(JSON.stringify(data))},${this.timeout});\n\t\t`//response

        let log_req:string = `\n\t\tlog.add_log("Get request PUT by ${endpoint}", String(JSON.stringify(req.body)))\n\t\t`
        let log_res:string = `log.add_log("Send response PUT by ${endpoint}", data)\n\t\t`

        let body = log_req + data_str + log_res + res
        let temp:string = `app.put('${endpoint.replace(new RegExp('{', 'g'), ':').replace(new RegExp('}', 'g'), '')}', (req, res) => {\n\t\tconsole.log("Get request PUT on ${endpoint}")\n\t\t${body}\n\t});\n\n\n`
        return temp
    }

    private add_method_post(endpoint: string, status: string[]): string {
        let data:object = {}
        if(status.includes("200")) data = this.reader.parsing_res(endpoint, "post", "200")
        else if(status.includes("201")) data = this.reader.parsing_res(endpoint, "post", "201")

        let data_str = `let data: any = ${JSON.stringify(data)}\n\t\t`//get mock-data

        let res = `setTimeout(()=>{res.send(JSON.stringify(data))},${this.timeout});\n\t\t`//response

        let log_req:string = `\n\t\tlog.add_log("Get request POST by ${endpoint}", String(JSON.stringify(req.body)))\n\t\t`
        let log_res:string = `log.add_log("Send response POST by ${endpoint}", data)\n\t\t`

        let body = log_req + data_str + log_res + res
        let temp:string = `app.post('${endpoint.replace(new RegExp('{', 'g'), ':').replace(new RegExp('}', 'g'), '')}', (req, res) => {\n\t\tconsole.log("Get request POST on ${endpoint}")\n\t\t${body}\n\t});\n\n\n`
        return temp
    }

    private add_method_get(endpoint: string, status:Array<string>, parameters:Array<object>|null):string {
        let data:object = this.reader.parsing_res(endpoint, "get", "200")// there will be mock-data from exsamples OpenAPI
        let temp:string = ``
        let param:Array<any>|null = parameters
        let log_req:string, log_res:string = ``

        if (parameters != null){
            let body = ``

            let buffer = `` //read parameters
            param?.forEach(item => {
                buffer += `${item.name}: req.${this.type_param(item.in)}.${item.name},\n`
            })
            let obj_param = `let param:object = {${buffer}\t\t}\n\t\t`

            let data_str = `let data: Array<any>|undefined = ${JSON.stringify(data)}\n\t\t`//get mock-data
            let filter = `data = filter.filtration(param, data)\n\t\t`//filter data
            let res = `setTimeout(()=>{res.send(JSON.stringify(data))},${this.timeout});`//response

            log_req = `\n\t\tlog.add_log("Get request GET by ${endpoint}", String(JSON.stringify(param)))\n\t\t`
            log_res = `\n\t\tlog.add_log("Send response GET by ${endpoint}", data)\n\t\t`

            body = obj_param + log_req + data_str + filter + log_res + res

            temp = `app.get('${endpoint.replace(new RegExp('{', 'g'), ':').replace(new RegExp('}', 'g'), '')}', (req, res) => {\n\t\tconsole.log("Get request GET on ${endpoint}")\n\t\t${body}\n\t});\n\n\n`
        }else{
            //console.log(status)
            log_req = `\n\t\tlog.add_log("Get request GET by ${endpoint}", "Without parameters or parameters is wrong")\n\t\t`
            log_res = `\n\t\tlog.add_log("Send response GET by ${endpoint}", ${String(JSON.stringify(data))})\n\t\t`
            temp = `app.get('${endpoint.replace(new RegExp('{', 'g'), ':').replace(new RegExp('}', 'g'), '')}', (req, res) => {${log_req}\n\t\tconsole.log("Get request GET on ${endpoint}")\n\t\t${log_res}setTimeout(()=>{res.send(${JSON.stringify(data)})},${this.timeout});\n\t});\n\n\n`
        }
        
        return temp
    }

    private add_script_start(port:number):string{
        let start = `app.listen(${port}, () => {\n\t\tconsole.log("Server is starting on ${port}")\n\t})`
        return start
    }

    private type_param(str:string):string{
        switch (str){
            case "path":
                return "params"
            case "query":
                return "query"
            case "header":
                return "headers"
            default:
                return "cookies"
        }
    }

    private random_status(status_res:Array<string>):string{
        return status_res[(Math.floor(Math.random() * status_res.length))]
    }
}

export default Creator

