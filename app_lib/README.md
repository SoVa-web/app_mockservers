Firts use - cd node_modules/simple-mock-services

Command for Powershell for using from terminal:

- Create mock-service -  npm run simple_create_ms --arg1 "port" --arg2 "absolute ot relative path to OpenAPI .yaml" --arg3 "name mockservice" --arg4 "timeout for responses" (then you see relative path to script mock-service)

- Run mock-service -  npm run simple_run_ms --arg1 "relative path to script mock-service (after step 1)"

- Show log path - npm run simple_log_ms --arg1 "name mock-service"

- Delete files - npm run simple_delete_ms --arg1 "name mock-service"

- Running server by command 
Command for using UI:

- first you must run server by command - npm run simple_start_server

- then you must use package ui_simple_mockservices https://github.com/SoVa-web/ui_simple_mockservices for running UI in your browser

App uses ports 3001, 5002, 5003 for local software deployment and 6379 for Redis server, when you runs UI. If you use this software with terminal, no port is used.