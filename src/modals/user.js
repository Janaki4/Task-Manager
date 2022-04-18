const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./tasks')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        validate(value) {

            if (!validator.isEmail(value)) {
                throw new Error('Email is wrong')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        min: 6,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password shouldnot contain text password itself')
            }
        }
    },
    age: {
        type: Number,
        trim: true,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age should be above 0')
            }
        }
    },
    avatar: {
        type:Buffer
    },
    tokens: [{
        token:{
        type: String,
            required:true
        }
    }]
}, {
    timestamps:true
})

userSchema.virtual('task', {
    ref: 'task',
    localField:'_id',
    foreignField:'owner'
})

userSchema.statics.findByUniqueLogin = async (email, password) => {
    
    const user = await UserModal.findOne({ email })
    if(!user) throw new Error('unable to login')
    console.log(user)
    const passCheck = await bcrypt.compare(password, user.password)
    if (!passCheck) { 
        console.log(passCheck)
        return  new Error({'error':"unable to login"})
    }
    console.log(passCheck)
    return user
}


userSchema.methods.generateJWT = async function () { 

    const user = this
    const token = jwt.sign({ id: user._id.toString() }, 'authenticate')
    user.tokens = user.tokens.concat({ token })
    console.log(token)
    await user.save()
    return token
}

userSchema.pre('save', async function (next) { 
    const user = this
    if (user.isModified('password')) { 

        user.password = await bcrypt.hash(user.password , 8)    
    }
    next()
})


userSchema.pre('remove', async function (next) { 
    const user = this
   await Task.deleteMany({ owner: user._id })
    next()
})


userSchema.methods.toJSON = function () { 
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens

    return userObject
}

const UserModal = mongoose.model('user',userSchema)

module.exports = UserModal



// const user1 = new UserModal({
//     name: 'Janaki',
//     email: 'janaki@gmail.io',
//     password:"janakir"
// })
// user1.save().then(res=>console.log(res)).catch(e=>console.log(e))


