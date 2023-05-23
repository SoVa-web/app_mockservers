//import {readFile} from 'node:fs/promises'
//import yaml from  'yaml'
import OpenAPIV3 from 'openapi-types';
import SwaggerParser from '@apidevtools/swagger-parser'
import converter from './converter.ts';

class ReadWriter{
    public yaml_content: any;
    public path_openapi: string

    constructor(path: string){   
        this.path_openapi = path
    }

    async read_openapi():Promise<void>{
        this.yaml_content = await SwaggerParser.parse(this.path_openapi)
        console.log(this.yaml_content.paths["/no_auth/pets"].post)
        converter.convert_without_components(this.yaml_content)
        console.log(this.yaml_content.paths["/no_auth/pets"].post.requestBody.content['application/json'].schema.properties)
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
    //перед викликом перевіряти data на undefined
    //new ver
    get_endpoints: function(data:OpenAPIV3.OpenAPI.Document<{}>):Array<object>{
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
                in: "path/query/header"
                type:
            },
            {
                ...
            }
        ]
    */

    get_parameters:function(method_req: string, endpoint: string, data:OpenAPIV3.OpenAPI.Document<{}>):Array<object>{
        let arr_parameters:Array<object> = []
        let paths = data.paths 
        if(paths){
            let endp = paths[endpoint]
            if(endp){
                if(endp?.parameters){
                    //перевіряємо параметри на рівні шляху
                }

                let method:any
                switch (method_req){
                    case "get":
                        method = endp.get
                        break;
                    case "post":
                        method = endp.post
                        break;
                    case "put":
                        method = endp.put
                        break;
                    case "delete":
                        method = endp.delete
                        break;
                    case "patch":
                        method = endp.patch
                        break;
                    default:
                        method = undefined
                        break;
                }    

                if(method && method.parameters){
                    //перевіряємо параметри на рівні методу
                }
                
                
            }
        }
        return arr_parameters
    }

    /* 
    1. Метод парсингу параметрів з урахуванням components
    2. Метод повернення відповіді з урахуванням components
    3. Метод валідації тіла запиту методу post відповідно до файлу свагера
    4. Метод створення нового ресурсу методом post
    5. Підв'язати це все до  Creator
    6. Підв'язати простеньку GUI
    */


}

export default ReadWriter