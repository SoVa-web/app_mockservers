import express from 'express'
import bodyParser from 'body-parser'
import API_LIB from './app.ts'
import redis_server from './redis_logging.ts'
import http from 'http';
import { Server } from 'socket.io';

const port = 5002
const port_socket = 5003
const api = new API_LIB()

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*')
    next();
  });

app.get("/create", async (req, res)=>{
    let port:any = req.query.port
    console.log("Порт", req.query.port)
    let path_openapi:string = String(req.query.path_openapi)
    let name_project:string = String(req.query.name_project)
    let delay:number = Number(req.query.delay)
    let status_er = await API_LIB.create(port, path_openapi, name_project, delay)
    if(status_er === -1)
        res.status(400).send(JSON.stringify('Invalid data from client'))
    else 
        res.status(200).send(JSON.stringify(`Successfully created mock-service with name:  ${name_project}`))
})

app.get("/run", (req, res)=>{
    let name_project:string = String(req.query.name_project)
    let port:number = Number(req.query.port)
    try{
        api.run(name_project, port)
    }catch(err){
        res.status(500).send(JSON.stringify('Mock-services not running, script for runnnig not found'))
    }
    res.status(200).send(JSON.stringify(`Successfully ran mock-service ${name_project}`))
})

app.get("/stop", (req, res)=>{
    let name_project:string = req.body.name_project
    try{
        api.stop(name_project)
        res.status(200).send(JSON.stringify(`Successfully stopped mock-service ${name_project}`))
    }catch{
        res.status(500).send(JSON.stringify(`Failed stopping mock-service ${name_project}`))
    }
})

app.get("/delete", async (req, res)=>{
    let name_project:string = String(req.query.name_project)
    try{
        await API_LIB.delete(name_project)
        res.status(200).send(JSON.stringify(`Successfully deleted mock-service ${name_project}`))
    }catch{
        res.status(500).send(JSON.stringify(`Failed deleting mock-service ${name_project}`))
    }
})

//reading logs and sending it to client
app.get("/log", async (req, res)=>{
    let name_project:string = String(req.query.name_project)
    let data = ""
    try{
        data = await redis_server.get_log_redis(name_project)
        res.status(200).send(JSON.stringify(data))
    }catch{
        res.status(500).send(JSON.stringify(`Failed reading logs in mock-service ${name_project}`))
    }
})

app.get("/list", (req, res)=>{
    res.send(api.get_list())
    try{
        res.status(200).send(JSON.stringify(api.get_list()))
    }catch{
        res.status(500).send(JSON.stringify(`Failed getting list mock-services`))
    }
})

const server = http.createServer(app)
  const io = new Server(server, {
        path: '/',
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
            
            credentials: true
        },
        allowEIO3: true
    })
  
  io.on('connection', (socket)=>{
      console.log("Client connected")
  
      socket.on('redis', (data) => {
        console.log(data)
          io.emit('log', data)
      });
      
      socket.on('disconnect', () => {
          console.log('Client disconnected');
      });
  })

server.listen(port_socket, () => {
    console.log(`Web-socket server is starting on ${port_socket}`)
})

app.listen(port, () => {
    console.log(`Server is starting on ${port}`)
})