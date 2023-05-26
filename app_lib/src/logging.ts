//import {writeFile, readFile} from 'node:fs/promises'
import { error } from 'console'
import * as fs from 'fs'

export class Logging{
    path_log:string

    constructor(path_log:string){
        this.path_log = path_log
    }

    add_log_request():void{
        fs.writeFile(this.path_log, "", (error)=>{

        })
    }

    add_log_response():void{
        fs.writeFile(this.path_log, "", (error)=>{

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