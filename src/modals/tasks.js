const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required:true
    }, 
    completed:{
        type: Boolean,
        default:false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'user'
    }
} ,
{
        timestamps:true
    })

const taskModal = mongoose.model('task', taskSchema )

module.exports= taskModal

// const task = new taskModal({
//     description: 'Higher studies '
// })

// task.save().then(res => { 
//     console.log(res)
// }).catch(e => { 
//     console.log(e)
// })