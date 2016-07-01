var express = require('express');

var bodyParser = require('body-parser');

var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// var todos = [{
// 	id: 1, 
// 	description: 'Meet mom for lunch',
// 	completed: false
// }, {
// 	id: 2, 
// 	description: 'Go to market',
// 	completed: false
// },{
// 	id: 3,
// 	description: 'Feed the cat',
// 	completed: true
// }];

var todos = [];
var todoNextId = 1;

app.get('/', function(req, res){
	res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function(req, res){
	res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res){
	var todoId = req.params.id;
	var todoItem;

	for(var index in todos){
		console.log(todos[index]);
		if(todos[index].id === parseInt(todoId)){
			todoItem = todos[index];
		}
	}
	
	//res.send('Asking for todo with of ' + req.params.id);
	if(todoItem){
		res.json(todoItem);
	} else {
		res.status(404);
		res.send('cann\'t find the info');
	}
	
});

// POST /todos
app.post('/todos', function(req, res){
	var body = req.body;

	body.id = todoNextId++;
	todos.push(body);

	console.log('description' + body.description);
	res.json(body);
});

app.listen(PORT, function(){
	console.log("express is listening on port: " + PORT + ' !');
});