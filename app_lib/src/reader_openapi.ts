import OpenAPIV3 from 'openapi-types';
import SwaggerParser from '@apidevtools/swagger-parser'
import converter from './converter.ts';

class ReadWriter{
    public yaml_content: OpenAPIV3.OpenAPI.Document<{}>|undefined = undefined;
    public path_openapi: string

    constructor(path: string){   
        this.path_openapi = path
    }

    async read_openapi():Promise<void>{
        try{
            this.yaml_content = await SwaggerParser.parse(this.path_openapi)
            
        }catch(err){
            console.error("Reading is failed in method read_openapi()")
            return
        }
        converter.convert_without_components(this.yaml_content)
    }

    parsing_endpoints():Array<object>{
        let buf = this.get_endpoints(this.yaml_content)
        //console.log(buf)
        return  buf
    }

    parsing_parameters(method_req: string, endpoint: string): Array<object> {
        return this.get_parameters(method_req, endpoint, this.yaml_content)
    }

    parsing_res(endpoint: string, method:string, status: string): any {
        return this.get_mockdata(endpoint, method, status, this.yaml_content)
    }

    private get_endpoints(data: OpenAPIV3.OpenAPI.Document<{}>|undefined): Array<object> {
        let obj: any = data;
        let arr: Array<any> = [];
        let buffer: string = "";
        for (let i in obj.paths) {
            for (let j in obj.paths[i]) {
                let res = [];
                for (let status in obj.paths[i][j].responses) {
                    res.push(status);
                }

                arr.push({
                    endpoint: i,
                    method: j,
                    responses: res
                });
            }
        }

        return arr;
    }

    private get_parameters(method_req: string, endpoint: string, data: any): Array<object> {
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
    }

    private get_mockdata(endpoint: string, method:string, status: string, data: OpenAPIV3.OpenAPI.Document<{}> | undefined) {
        let res_data: any = undefined;
        let obj: any = data;
        let buff = obj?.paths[endpoint]?.[method]?.responses[status]?.content;
        buff = buff?.["application/json"]||buff?.["application/xml"]||buff?.["application/x-www-form-urlencoded"]
        if (buff) {
            if (buff.examples) { // array
                res_data = [];
                 for (let key in buff.examples) {
                    res_data.push(buff.examples[key].value);
                }
            }
             if (buff.example) res_data = buff.example
        }else res_data = obj?.paths[endpoint]?.[method]?.responses?.[status]
        return res_data;
    }
}

export default ReadWriter