Firts use - cd node_modules/simple-mock-services

Command for Powershell:

- Create mock-service -  npm run simple_create_ms --arg1 "port" --arg2 "absolute ot relative path to OpenAPI .yaml" --arg3 "name mockservice" --arg4 "timeout for responses" (then you see relative path to script mock-service)

- Run mock-service -  npm run simple_run-ms --arg1 "relative path to script mock-service (after step 1)"

- Show log path - npm run simple_log_ms --arg1 "name mock-service"

- Delete files - npm run simple_delete_ms --arg1 "name mock-service"

- Running server by command - npm run simple_start_server