// implement your API here
const express = require('express'); 
const DataBase = require('./data/db.js')


const server = express();
// For the middleware 
server.use(express.json());

// routes & endpoints 


// Get Request
server.get('/api/users', (req, res) => {

    DataBase.find() //Returns a promise 
    .then(users => {
        res.status(200).json(users)
    })
    .catch(error => {
        console.log(error)
        // handle errors
        res.status(500).json({ errorMessage: 'The user info is not found '})
    })
    
})

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id
    DataBase.findById(id) // Returns a promise
    .then(users => {
        res.status(200).json(users)
    })
    .catch(error => {
        console.log(error)
        // handle errors
        res.status(404).json({ errorMessage: "specified ID not found"})
    })
})

//  POST 

server.post('/api/users', (req, res) => {
    console.log(req.body);
    const { name, bio } = req.body;
    console.log('body', req.body)
    // validate data
    if (!name || !bio) {
        DataBase.add(req.body).then(database => {
            res.status(201).json(database);
        }).catch( err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'ooops'})
        })
        res.status(400).json({ errorMessage: "provide name and bio for the user." })
    }
    DataBase.insert({ name, bio})
    .then(({ id }) => {
        DataBase.findById(id)
        .then(users => {
            res.status(201).json(users);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'error while saving user to database'});
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ errorMessage: 'server error completing user'})
    });
});

// Delete 

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    DataBase.remove(id)
    .then(deleted => {
        res.status(200).json(deleted);
   if(deleted){
       res.status(404).end()
   } else {
        res.status(404).json({errorMessage: "The user with that ID does not exist"})
    }
    })

    .catch(error => {
        console.log(error);
        // handle the error
        res.status(500).json({
            errorMessage: "the user could not be removed",
        });
    });
});



const port = 5001;
server.listen(port, () => console.log(`\n** Api on port ${port}\n`))
