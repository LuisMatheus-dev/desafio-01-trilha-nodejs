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

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const exists = users.find(( user ) => user.name === name || user.username === username);
  

  if(exists) {
    response.status(400).send('User already exists ❌');  
  }

  users.push({
    name,
    username,
    uuid: uuidv4()
  });

  
  return response.status(200).json(users);   
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  
  response.status(200).json(request.user)
  
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;