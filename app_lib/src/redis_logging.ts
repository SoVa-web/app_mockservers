import Redis from 'ioredis'

export class Logging_Redis{
    public redis_server: Redis

    constructor(){
        this.redis_server = new Redis({
            host: 'localhost',
            port: 6379
        })
    }

    //async adding
    add_log_redis(name:string, data:string, req_res_data:any):void{
        let date = new Date()
        let content:string = ""
        content += data
        content += JSON.stringify(req_res_data)
        content += `time: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} UTC \n\n`

        //public in pub/sub redis channel log
        
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
                        content += "\n\n"
                    })
                    resolve(content)
                }              
            });
        })
    }
}

const redis_server: Logging_Redis = new Logging_Redis()

export default redis_server