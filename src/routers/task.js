const express = require('express')
const auth = require('../middleware/auth')
const app = new express.Router()
const Task = require('../modals/tasks')

app.post('/tasks',auth,  async(req, res) => {
    const task = new Task({
        ...req.body,
        owner:req.user._id
    }
)
    try {
        const tasksResult = await task.save()
        res.status(201).send(tasksResult)
    }
    catch (e) {     
        res.send(e)    }
    // task.save().then(result=>res.status(201).send(result)).catch(e=>res.status(400).send(e))
 })

//reading user and user by id from db




app.get('/tasks', auth, async (req, res) => { 
    let match= {}
    if (req.query.completed) { 
        match.completed= req.query.completed ==='true'
    }

    try {
        await req.user.populate({
            'path': 'task',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip:parseInt(req.query.skip)
            }
        }
        )
        console.log(req.user)
        res.status(201).send(req.user.task)
    }
    catch (e) { 
        res.status(500).send(e)
    }
    

})

app.get('/tasks/:id',auth,async(req, res) => {
    const _id = req.params.id

    try {
        const taskByID = await Task.findOne({_id , owner:req.user._id})
        if (!taskByID) { 
            return res.status(404).send("No user found")
        }
        res.status(201).send(taskByID)
     }
    catch (e) { 
        res.status(500).send(e)
    }
    
})
 

app.patch('/tasks/:id',auth, async (req, res) => { 
    const keys_ = Object.keys(req.body)
    const requiredKeys = ['description', 'completed']
    const isValid = keys_.every((key) => requiredKeys.includes(key))
    console.log(isValid)
    if (!isValid)
    {
        return res.status(400).send('Enter valid key')
    }

    try {
        // const updatetask =await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        // const updatetask = await Task.findById(req.params.id)
        const updatetask = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!updatetask) { 
            return res.status(404).send('error , Key not found')
        }

        keys_.forEach((key) => updatetask[key] = req.body[key])
        await updatetask.save()

       
        res.send(updatetask)
    }
    catch (e) {
        res.status(400).send(e)
     }
})

app.delete('/tasks/:id', auth,async (req, res) => { 

    try{ 
        // const deletingTask = await Task.findByIdAndDelete(req.params.id)
        const deletingTask = await Task.findOneAndDelete({_id:req.params.id , owner:req.user._id})
        if (!deletingTask) { 
            return res.status(401).send({Error:'No data foujnd by that id '})
        }
        res.send(deletingTask)
    }
    catch (e) { 
        res.status(400).send(e)
    }

})

module.exports=app
