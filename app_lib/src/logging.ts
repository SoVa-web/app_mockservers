//import {writeFile, readFile} from 'node:fs/promises'
import * as fs from 'fs'
import path from 'path'

export class Logging{
    private path_log:string

    constructor(path_log:string){
        this.path_log = path_log
    }

    add_log_redis(data:string, req_res_data:any):void{

    }

    show_log_redis(name:string){

    }

    //method adding logs
    add_log(data:string, req_res_data:any):void{
        let date = new Date()
        let content:string = ""
        content += data
        content += JSON.stringify(req_res_data)
        content += `time: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} UTC \n\n`
        fs.appendFile(this.path_log, content, (error)=>{
            //console.log(`Recording logs in file ${this.path_log}`, error);
        })
    }

    //method showing logs
    static show_log(name:string):Promise<string>{
        let cont:string = "Error reading"
        let path:string = `../log/${name}.log`
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf8', (err, content) => {
              if (err) {
                reject(err);
              } else {
                resolve(content);
              }
            });
        })
    }
}

export default Logging