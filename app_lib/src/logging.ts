//import {writeFile, readFile} from 'node:fs/promises'
import * as fs from 'fs'
import path from 'path'

export class Logging{
    path_log:string

    constructor(path_log:string){
        this.path_log = path_log
    }

    add_log(data:string, req_res_data:any):void{
        let date = new Date()
        let content:string = ""
        content += data
        content += JSON.stringify(req_res_data)
        content += `time: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} UTC \n`
        fs.appendFile(this.path_log, content, (error)=>{
            console.error(`Запис логів події у файл ${this.path_log}`, error);
        })
    }

    static show_log(name:string):string{
        let content:string = "Error reading"
        let path:string = `../log/${name}.log`
        fs.readFile(path, 'utf-8', (error, content)=>{
            if (error) {
                console.error(`Error reading file ${path}`, error);
              } else {
                return content
              }
        })
        return content
    }
}

export default Logging