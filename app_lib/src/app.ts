import Creator from './creator.ts'
import ReadWriter from './reader_openapi.ts'
import { exec, ChildProcess} from 'child_process'
import { unlink } from "node:fs/promises"
import Logging from './logging.ts'
import path from 'path'

interface Object_RunningMockservice{
    port: number
    name: string
    child_mockservice: ChildProcess
}

export class API_LIB{
    arr_child_process:Array<Object_RunningMockservice> = []

    static create(port:number, path_openapi:string, name_project:string, delay:number):void{
        let creator:Creator|undefined = undefined
        let reader = new ReadWriter(path_openapi, name_project)
        reader.read_openapi().then(()=>{
            creator = new Creator(port, name_project, delay, reader)
            creator.create()
            console.log("Created mock service by path " + creator.path_file_script + "\n")
            console.log(`Created log file by path ${path.resolve(creator.path_file_log)}`)
        })
    }


    run(name_project: string, port:number):void{
        let path_file_script = `../data/${name_project}.ts`
        let child_server = exec(`node --loader ts-node/esm ${path_file_script}`);

        child_server.on('exit',(status)=>{
            console.log(`Процес завершився з кодом виходу: ${status}`);
        })

        this.arr_child_process.push({
            port: port,
            name: path_file_script,
            child_mockservice: child_server
        })
    }

    stop(name:string):void{ //new ver
        let name_mockservice = `../data/${name}.ts`
        this.arr_child_process.forEach(item => {
            if(item.name = name_mockservice){
                item.child_mockservice.kill()
                let index = this.arr_child_process.indexOf(item);
                this.arr_child_process.splice(index, 1);
            }
        })
    }

    get_list():Array<object>{
        let res:Array<object> = []
        this.arr_child_process.forEach(mock=>{
            res.push({
                name: mock.name,
                port:mock.port
            })
        })
        return res
    }

    static delete(name:string):void{
        let path_file_script = `../data/${name}.ts`
        let path_log = `../log/${name}.log`
        unlink(path_file_script).then(()=>{
            console.log("File mock-service deleted successfully", path_file_script)
        })
        unlink(path_log).then(()=>{
            console.log("File log deleted successfully", path_log)
        })
    }

    static show_log(name:string):string{
        return Logging.show_log(name)
    }

    static show_log_path(name:string):void{
        let path_log: string = `../log/${name}.log`
        console.log(`Created log file by path ${path.resolve(path_log)}`)
    }
}


export default API_LIB



