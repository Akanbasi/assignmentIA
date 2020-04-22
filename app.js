const express = require('express');


const app = express();
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'
const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true })

let Db;
let Collection;

// this function connects the the mongodb
const newConn = async () => {
    await client.connect();
    Db = client.db('employeedb');
    Collection = Db.collection('todo');
    
} 
newConn();

const Todo = async (data) => {
    try {
        const result = await Collection.insertOne(data);
        return result;

    } catch (error) {
        console.log(error)
    }
}

const AllTodo = async () => {
    try {
        const result = await Collection.find({}).toArray();
        return result;
    } catch (error) {
        console.log(error)
    }
}




app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

const employees = [
    {
        name: "Felix Akanbasi",
        employeeID: "021001",
        position: "General Manager"
    },
    {
        name: "Abdul Latif",
        employeeID: "021002",
        position: "Chief Cleaner"
    },
    {
        name: "Amanda Wallace",
        employeeID: "021003",
        position: "Head of Security"
    }
]

app.get('/', (req, res) => {
    res.render('brabus', { employees });
});

app.get('/employeeList', (req, res)=>{
    res.render('employees', {
        employees
    })
});
app.post('/upload', async (req, res) => {
    const data = {
        activity: req.body.activity,
        status: req.body.status
    }
    const result = await createTodo(data);
    res.redirect('/todoList')
});
app.get('/todoList', async (req, res)=>{
    const todolist = await AllTodo();
    res.render('todolist', {
        todolist
    })
})

const port = 5880;
app.listen(port, ()=>{
    console.log(`Server has started on port ${port}`);
})