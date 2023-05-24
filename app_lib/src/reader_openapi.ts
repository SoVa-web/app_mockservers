//import {readFile} from 'node:fs/promises'
//import yaml from  'yaml'
import OpenAPIV3 from 'openapi-types';
import SwaggerParser from '@apidevtools/swagger-parser'
import converter from './converter.ts';
import { writeFile } from 'fs/promises'; 

class ReadWriter{
    public yaml_content: any;
    public path_openapi: string

    constructor(path: string){   
        this.path_openapi = path
    }

    async read_openapi():Promise<void>{
        this.yaml_content = await SwaggerParser.parse(this.path_openapi)
        converter.convert_without_components(this.yaml_content)
    }

    parsing_endpoints():Array<object>{
        return  reader.get_endpoints(this.yaml_content)
    }

    parsing_parameters(method_req: string, endpoint: string):Array<object> {
        return reader.get_parameters(method_req, endpoint, this.yaml_content)
    }
}

export interface IReader{
    get_endpoints(data:OpenAPIV3.OpenAPI.Document<{}>|undefined):Array<object>
    get_parameters(method_req: string, endpoint: string, data:OpenAPIV3.OpenAPI.Document<{}>|undefined):Array<object>
    get_mockdata_get(endpoint:string, status:string, data:OpenAPIV3.OpenAPI.Document<{}>|undefined):any
}

let reader: IReader = {
    get_endpoints: function (data: OpenAPIV3.OpenAPI.Document<{}>): Array<object> {
        let obj: any = data;
        let arr: Array<any> = [];
        for (let i in obj.paths) {
            for (let j in obj.paths[i]) {
                arr.push({
                    endpoint: i,
                    method: j,
                    responses: obj.paths[i][j].responses
                });
            }
        }

        return arr;
    },

    get_parameters: function (method_req: string, endpoint: string, data: any): Array<object> {
        let arr_parameters: Array<object> = [];
        let paths = data.paths;
        if (paths) {
            let endp = paths[endpoint];
            if (endp) {
                let endpoint_param: Array<any> = endp.parameters;
                if (endpoint_param != undefined) {
                    endpoint_param.forEach((el) => {
                        arr_parameters.push({
                            name: el.name,
                            in: el.in
                        });
                    });
                }

                let method = endp[method_req];
                if (method && method.parameters) {
                    let arr: Array<any> = method.parameters;
                    if (arr != undefined) {
                        arr.forEach((el) => {
                            arr_parameters.push({
                                name: el.name,
                                in: el.in
                            });
                        });
                    }

                }
            }
        }
        return arr_parameters;
    },

    get_mockdata_get: function (endpoint: string, status:string, data: OpenAPIV3.OpenAPI.Document<{}> | undefined): any {
        let res_data:any = undefined
        let obj:any = data
        if(status[0] === '2'){//if status 2xx we return mock-data
            let buff = obj?.paths[endpoint].get.responses[status].content["application/json"]
            if(buff){
                if(buff.examples){// array
                    res_data = []
                    for(let key in buff.examples){
                        res_data.push(buff.examples[key].value)
                    }
                }
                if(buff.example){// any
                    res_data = buff.example 
                }
                // situation when examples and example exist in the same time isn`t implemented
            }
        }else{
            res_data = obj?.paths[endpoint].get.responses[status]
        }
        return res_data
    }
}

export default ReadWriter