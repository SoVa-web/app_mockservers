import express from 'express'
import bodyParser from 'body-parser'
import API_LIB from './app.ts'

const port = 5002
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

app.get("/create", (req, res)=>{
    let port:any = req.query.port
    console.log("Порт", req.query.port)
    let path_openapi:string = String(req.query.path_openapi)
    let name_project:string = String(req.query.name_project)
    let delay:number = Number(req.query.delay)

    try{
        API_LIB.create(port, path_openapi, name_project, delay)
    }catch(err){
        res.status(400).send(JSON.stringify('Invalid data from client'))
    }
    res.status(200).send(JSON.stringify(`Successfully created mock-service with name:  ${name_project}`))
})

app.get("/run", (req, res)=>{
    let name_project:string = String(req.query.name_project)
    let port:number = Number(req.query.port)
    try{
        api.run(name_project, port)
    }catch(err){
        res.status(500).send(JSON.stringify('Mock-services not running, happened error'))
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

app.get("/delete", (req, res)=>{
    let name_project:string = String(req.query.name_project)
    try{
        API_LIB.delete(name_project)
        res.status(200).send(JSON.stringify(`Successfully deleted mock-service ${name_project}`))
    }catch{
        res.status(500).send(JSON.stringify(`Failed deleting mock-service ${name_project}`))
    }
})

app.get("/log", (req, res)=>{
    let name_project:string = String(req.query.name_projec)
    let data = ""
    try{
        data = API_LIB.show_log(name_project)
        res.status(200).send(JSON.stringify(data))
    }catch{
        res.status(500).send(JSON.stringify(`Failed reading logs in mock-service ${name_project}`))
    }
})

app.get("/list", (req, res)=>{
    res.send(api.get_list())
})

app.listen(port, () => {
    console.log(`Server is starting on ${port}`)
})