//import {readFile} from 'node:fs/promises'
//import yaml from  'yaml'
import OpenAPIV3 from 'openapi-types';
import SwaggerParser from '@apidevtools/swagger-parser'

class Reader{
    public yaml_content: object
    public path_openapi: string

    constructor(path: string){
        this.yaml_content = {}    
        this.path_openapi = path
    }

    async read_openapi():Promise<void>{
        this.yaml_content = await SwaggerParser.parse(this.path_openapi)
    }

    parsing_endpoints():Array<object>{
        return  reader.get_endpoints(this.yaml_content)
    }

    exist_field_parameters(method_req: string, endpoint: string):Array<object> {
        return reader.check_type_parameters(method_req, endpoint, this.yaml_content)
    }
}

export interface IReader{
    get_endpoints(data:any):Array<object>
    check_type_parameters(method_req: string, endpoint: string, data:any):Array<object>
}

let reader: IReader = {
    /*
    example: 
    endpoints = [
        {
            endpoint: "/",
            method: "get"
        },
        {
            endpoint: "/pizza",
            method: "get"
        },
        ...
    ]
    */
    //парсинг енпоінтів та методів
    get_endpoints: function(data:any):Array<object>{
        let arr:Array<any> = []
        for(let i in data.paths){
            for(let j in data.paths[i]){
                arr.push({
                    endpoint: i,
                    method: j
                })
            }
        }

        return arr
    },

    /*
        [
            {
                name: "id",
                in: "path/query/undefined"
            },
            {
                ...
            }
        ]
    */
    //парсинг параметрів запиту за ендпоінтом і методом
    check_type_parameters: function(method_req: string, endpoint: string, data:any):Array<object>{
        let parsed_parameter:Array<object> = []
        let type_parameter:Array<any> = []

        if (data.paths[endpoint][method_req].parameters != undefined){
            type_parameter = data.paths[endpoint][method_req].parameters
        }else{
            return parsed_parameter
        }
    
        type_parameter.forEach(parameter=>{
            parsed_parameter.push({
                name: parameter.name,
                in: parameter.in
            })
        })
        return parsed_parameter
    }
}

export default Reader