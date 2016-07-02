var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db');

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

// GET /todos?completed=true&q=work
app.get('/todos', function(req, res){

	var queryParams = req.query;
	var filteredTodos = todos;

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
		filteredTodos = _.where(filteredTodos, {completed: true});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
		filteredTodos = _.where(filteredTodos, {completed: false});
	}

	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
		filteredTodos = _.filter(filteredTodos, function(todo){
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	} 

	res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res){
	var todoId = req.params.id;

	var todoItem;
	todoItem = _.findWhere(todos, {id: todoId});

	if(todoItem){
		res.json(todoItem);
	} else {
		res.status(404);
		res.send('cann\'t find the info');
	}
	
});

// POST /todos
app.post('/todos', function(req, res){
	//var body = req.body; // use _.pick to only pick description and completed
	var body = _.pick(req.body, 'description', 'completed');

	// call create on db.todo
	//   response with 200 and todo
	//  error e  res.status(400).json(e)

	// if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length == 0){
	// 	return res.status(400).send();
	// }

	db.todo.create(body).then(function(todo){
		res.json(todo.toJSON());
	}, function(e){
		res.status(400).json(e);
	});




	// // set body.description to be trimmed value
	// body.description = body.description.trim();

	// body.id = todoNextId++;
	// todos.push(body);

	// console.log('description' + body.description);
	// res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id, 10);

	var matchedTodo = _.findWhere(todos, {id: todoId});

	if(matchedTodo){
		todos = _.without(todos, matchedTodo);
	    res.json(matchedTodo);
	} else {
		res.status(404).json({"error": "no todo found with that id"});
	}
});

// PUT /todos/:id
app.put('/todos/:id', function(req, res){

	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if(matchedTodo){
		
		var body = _.pick(req.body, 'description', 'completed');

		if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
			matchedTodo.completed = body.completed;
		} else if (body.hasOwnProperty('completed')){
			return res.status(400).send();
		}

		if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length != 0){
			matchedTodo.description = body.description.trim();
		} else if (body.hasOwnProperty('description')){
			return res.status(400).send();
		}

		res.json(matchedTodo);

	} else {
		res.status(404).json({"error": "no todo found with that id"});
	}

});

db.sequelize.sync().then(function(){
	app.listen(PORT, function(){
	    console.log("express is listening on port: " + PORT + ' !');
    });
});







