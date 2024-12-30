// Import the express module
// Create an instance of an Express app
// Middleware for JSON request bodies
// connecting to moongoose
const express = require('express');

const mongoose = require('mongoose');
const cors = require('cors')
const app = express();

app.use(express.json());
app.use(cors())

mongoose.connect('mongodb://localhost:27017/mern-app')
.then(() =>{
    console.log('DB connected!')
})
.catch((err) =>{
    console.log(err)
})


//creating schema
const todoSchema = new mongoose.Schema({
    title : {
        required : true,
        type : String
    },
    description : String
    
})


// creating the model
const todoModel = mongoose.model('Todo', todoSchema)

// all routs for CRUD operations

// creating a new todo item
app.post('/todos', async (req, res) => {
    const { title, description } = req.body;
    try {
        const newTodo = new todoModel ({title, description});
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error){
        console.log(error)
        res.status(500).json({message: error.message}); 
    }
});


// getting all items
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find()
        res.json(todos);
    } catch(error){
        console.log(error)
        res.status(500).json({message: error.message}); 
    }
})

// updating the item
app.put("/todos/:id", async (req, res) => {
    try {
        const {title, description} = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { title , description},
            { new: true }
        )
        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found"})
        }
        res.json(updatedTodo)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }
})

// deleting an item
app.delete("/todos/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id)
        res.status(204).end();
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
        
    }
})

// Start the server
const port = 8000;
app.listen(port, () => {
    console.log('Server is listening on port' + port);
});
