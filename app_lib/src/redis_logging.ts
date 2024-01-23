import Redis from 'ioredis'
import socketIOClient from 'socket.io-client'

export class Logging_Redis{
    public redis_server: Redis
    private io: any

    constructor(){
        this.redis_server = new Redis({
            host: 'localhost',
            port: 6379
        })

        this.io = socketIOClient('http://localhost:5003/', {
            query:{
                username: "redis"
            }
        })
    }

    //async adding
    add_log_redis(name:string, data:string, req_res_data:any):void{
        let date = new Date()
        let content:string = ""
        content += data
        content += JSON.stringify(req_res_data)
        content += `time: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} UTC \n\n`

        this.io.emit('redis', {
            name_service: name,
            content: content
        })
        
        try {
            this.redis_server.rpush(name, content, (err, reply) => {
                if (err) throw err;
                console.log(`Log ${content} successfully added Redis. Number logs in list: ${reply}`);
            });
        } catch (error){
            console.error(`Error. Logs ${name} didn't add Redis.`, error);
        }
    }

    async get_log_redis(name:string): Promise<string>{
        let content:string = ""
        return new Promise((resolve, reject) => {
            this.redis_server.lrange(name, 0, -1, (err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    reply?.forEach(item => {
                        content += item
                        content += "\n"
                    })
                    resolve(content)
                }              
            });
        })
    }
}

const redis_server: Logging_Redis = new Logging_Redis()

export default redis_server