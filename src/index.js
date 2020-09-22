const express = require('express');
const { v4:uuidv4, validate } = require("uuid")

const app = express();
app.use(express.json());

const projects = [];

function logRequests(request, response, next){
    const {method, url} = request;

    const logLabel = `[${method.toUpperCase()} ${url}]`

    console.log(logLabel)
    console.time(logLabel)

    next() // Se colocar 'return', o que vem após do 'next()' não será executado.
           // Não é comum ter algo depois do 'next()'. Aqui é apenas para demonstração.

    console.timeEnd(logLabel) // Nesse caso, está servindo para saber quanto tempo
                              // levou cada requisição. Esse código é executado
                              // após a execução da rota.
};

function validadeProjectId(request, response, next){
    const {id} = request.params;

    if(!validate(id)){
        return response.status(400).json({error: "Invalid project ID"})
    }

    return next()
};

app.use(logRequests);
app.use('/projects/:id1', validadeProjectId)


app.get('/projects', (request, response) => {
    const {title} = request.query;

    const results = title
      ? projects.filter(project => project.title.includes(title))
      : projects

    return response.json(results);
});

app.post('/projects', (request, response) => {
    const {title, owner} = request.body;

    const project = {id: uuidv4(), title, owner}

    projects.push(project)

    return response.json(project);
})

app.put('/projects/:id', (request, response) => {
    const {id} = request.params;
    const {title, owner} = request.body;

    // const project = projects.find(project => project.id == id);
    const projectIndex = projects.findIndex(project => project.id == id);
    
    if(projectIndex < 0){
        return response.status(400).json({"error": "Project not found"})
    }

    const UpdatedProject = {
        id,
        title,
        owner,
    }

    projects[projectIndex] = UpdatedProject;

    return response.json(UpdatedProject);
})

app.delete('/projects/:id', (request, response) => {
    const {id} = request.params;

    const projectIndex = projects.findIndex(project => project.id == id);
    
    if(projectIndex < 0){
        return response.status(400).json({"error": "Project not found"})
    }

    projects.splice(projectIndex, 1)
    
    return response.status(204).send();
})

app.listen(3335, () => {
    console.log("Back-end started!")
});
