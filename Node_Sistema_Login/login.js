const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const mysql = require('mysql');
const path = require('path');

//conectando a base de dados
 const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodelogin'
 
});

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true

}));

app.use(express.static(__dirname + '/frontend'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//exibir a pagina de login
app.get('/', function(request, response){
    response.sendFile(path.join(__dirname +'/login.html'));
})


app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('O usuario ou a senha esta incorreto, tente novamente');
			}			
			response.end();
		});
	} else {
		response.send('Por favor, digite seu usuario e senha');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Seja bem vindo De volta ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen(3000);