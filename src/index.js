const express = require('express')
const app = express()
app.use(express.json())
require('./db/mongoose')

const taskrouter = require('../src/routers/task')
const userRouter = require('../src/routers/user')
const port = process.env.PORT 




app.use(userRouter)
app.use(taskrouter)


// const multer = require('multer')
// const upload = multer({
//     dest:"images"
// })


// app.post('/upload', upload.single('upload'),(req, res) => { 

//     res.send()
// })


app.listen(port, () => { 
    console.log(`server is up on ${port}`)
})



// const tasks = require('./modals/tasks')

// const main = async (id)=>  { 
//     const task = await tasks.findOne({id})
//     await task.populate('owner')
//     console.log(task.owner)
// }

// main('62595fa11acb65a70ef25ec9')





// const bcrypt= require('bcrypt')

// const passwordhASHING = async (x) => {

//     const password = await bcrypt.hash(x, 8)
//     console.log(password)

//     const comparing = await bcrypt.compare('janakiraman0203', password)
//     console.log(comparing)
// }
 
// passwordhASHING('janakiraman0203')


