const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { name, username } = request.body;
  
  const account = users.find(( user ) => user.name === name || user.username === username);

  if(!account) {
    response.status(400).send("User not found ❌")
  } 

  request.user = account; 

  return next();
}


function checksExistsTask(request) {
  
  const { user } = request;
  const { title } = request.body;

  const task = user.tasks.find(task => task.title === title);
  return task || false;

}

const deadlineOnFormat = (deadline) => deadline.split('-').length === 3;

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const exists = users.find(( user ) => user.name === name || user.username === username);
  

  if(exists) {
    response.status(400).send('User already exists ❌');  
  }

  users.push({
    name,
    username,
    uuid: uuidv4(),
    tasks: [],
  });
  
  return response.status(200).send('User created for successfully ✔️');   
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  
  const account = users.find( ( user ) => user.username === request.user.username);
  const todos = account.tasks; 

  response.status(200).json(todos)
});


app.post('/todos', checksExistsUserAccount, (request, response) => {
  
  const { title, deadline } = request.body;  

  if (!deadlineOnFormat(deadline)) {
 
    response.status(400).json({ 
      error: 'Deadline needs to be in format YYYY-MM-DD ❌',
    })
    
  } else if (checksExistsTask(request)) {
    response.status(400).send('Task already exists ❌');

  } else {
    const accountIndex = users.findIndex( ( user ) => user.username === request.user.username);
       
    users[accountIndex].tasks.push({ 
      id: uuidv4(),
      title, 
      done: false,
      deadline: new Date(deadline), 
      created_at: new Date()
    });
  
    response.status(200).send('Task successfully created ✔️');      
  };
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params
  const { username } = request.headers;
  const { deadline, title } = request.body;

  const accountIndex = users.findIndex(( user ) => user.username === username);
  const taskIndex = users[accountIndex].tasks.findIndex(( task ) =>  task.id === id);

  if(!!taskIndex) {
    response.status(404).json( { Error: 'Task id not found ❌'} );
  
  } else if (!deadlineOnFormat(deadline)) {

    response.status(400).json({ 
      error: 'Deadline needs to be in format YYYY-MM-DD ❌',
    });  
  }

  users[accountIndex].tasks[taskIndex].title = title;
  users[accountIndex].tasks[taskIndex].deadline = new Date(deadline);

  response.status(200).json({ task_update: users[accountIndex].tasks[taskIndex]});
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;