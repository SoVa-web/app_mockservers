//import {writeFile, readFile} from 'node:fs/promises'
import * as fs from 'fs'

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
        content += `time: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds} UTC \n`
        fs.appendFile(this.path_log, content, (error)=>{
            console.error(`Запис логів події у файл ${this.path_log}`, error);
        })
    }

    show_log():string{
        fs.readFile(this.path_log, 'utf-8', (error, content)=>{
            if (error) {
                console.error(`Помилка читання файлу ${this.path_log}`, error);
              } else {
                return content
              }
        })
        return "Помилка читання"
    }
}

export default Logging