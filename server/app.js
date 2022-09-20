import express from "express";
import cors from 'cors';
import bodyParser from "body-parser";

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

const todos = [{ title: "Wash the dishes", done: false }];

app.get("/todos", (req, res) => {
	res.status(200).send(todos);
});

app.post("/todos", (req, res) => {
	const { title } = req.body;

	todos.push({ title, done: false });

	res.status(200).send(todos[todos.length - 1]);
});

app.listen(port, (error) => {
	if(!error) 
		console.log("Server is Successfully Running, and App is listening on port "+ port)
	else 
		console.log("Error occurred, server can't start", error);
	}
);

