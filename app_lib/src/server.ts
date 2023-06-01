import express from 'express'
import bodyParser from 'body-parser'
import API_LIB from './app.ts'

const port = Number(process.argv[2])
const api = new API_LIB()

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/create", (req, res)=>{
    let port:number = req.body.port
    let path_openapi:string = req.body.path_openapi
    let name_project:string = req.body.name_project
    let delay:number = req.body.delay

    API_LIB.create(port, path_openapi, name_project, delay)

    res.send(`Successfully created mock-service ${name_project}`)
})

app.get("/run", (req, res)=>{
    let name_project:string = req.body.name_project
    let port:number = req.body.port
    api.run(name_project, port)

    res.send(`Successfully ran mock-service ${name_project}`)
})

app.get("/stop", (req, res)=>{
    let name_project:string = req.body.name_project
    api.stop(name_project)

    res.send(`Successfully stopped mock-service ${name_project}`)
})

app.get("/delete", (req, res)=>{
    let name_project:string = req.body.name_project
    API_LIB.delete(name_project)

    res.send(`Successfully deleted mock-service ${name_project}`)
})

app.get("/log", (req, res)=>{
    let name_project:string = req.body.name_project
    let data = API_LIB.show_log(name_project)
    res.send(data)
})

app.get("/list", (req, res)=>{
    res.send(api.get_list())
})

app.listen(port, () => {
    console.log(`Server is starting on ${port}`)
})