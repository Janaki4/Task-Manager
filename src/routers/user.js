const express = require('express')
const auth = require('../middleware/auth')
const app = new express.Router()
const User = require('../modals/user')
const multer = require('multer')
const sharp = require('sharp')
//Creating user and tasks and saving it to the db 
app.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateJWT()

       
        res.status(201).send({user , token})
     }
    catch (e) { 
        res.status(404).send(e)
    }
    // user.save().then(result => { res.status(201).send(result) }).catch(e => {res.status(400).send(e) })
})

app.get('/users/me',auth,async (req, res) => { 
   
    res.send(req.user)
})


app.patch('/users/me', auth,async (req, res) => {
    const key = Object.keys(req.body)
    const requiredKeys = ['name','age', 'email','password']
    const isKeyValid = key.every((val) => requiredKeys.includes(val))
    if (!isKeyValid) { 
        return res.status(404).send('enter key is not found')
    }
    try {
        // const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        // const updatedUser = await User.findById(req.params.id)
        
        key.forEach((k) => req.user[k] = req.body[k])

        await req.user.save()

        res.send(req.user)
    }
    catch (e) { 
        res.status(400).send('Error in the request')
    }
})

app.delete('/users/me',auth, async (req, res) => { 

    try{ 
        
        await req.user.remove()
        // await req.user.save()
        res.send('success')
    }
    catch (e) { 
        res.status(400).send(e)
    }

})


app.post('/users/login', async (req, res) => {
    try { 
        const user = await User.findByUniqueLogin(req.body.email, req.body.password)
        
        const token =await user.generateJWT()

        res.send({user , token})
    }   
    catch (e) {
        res.status(401).send('no user found')
     }
 })

app.post('/users/logout', auth, async (req, res) => { 

    try { 
        console.log(req.token)
        req.user.tokens = req.user.tokens.filter((token) => {
            // if()
            return token.token !== req.token
        })
        console.log(req.user)
        await req.user.save()
        res.send(req.user)
    }
    catch (e) { 
        res.status(401).send(e)
    }
})

app.post('/users/logoutAll', auth, async (req, res) => {
    try { 
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    }
    catch (e) { 
        res.status(401).send(e)
    }

 })

 const upload = multer({
     limits: {
         fileSize:1000000
     },
     fileFilter(req, file, cb) {
         if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) { 
            return cb(new Error('Please upload jpg or jpeg or png file '))
         }
         cb(undefined , true)
      }
})



app.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => { 
    const buffer = await sharp(req.file.buffer).resize({width:300 , height:300}).png().toBuffer()
   
    req.user.avatar = buffer
    // console.log(buffer)
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error:error.message})

 })

app.delete('/users/me/avatar', auth, async(req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send('deleted')
})
 
app.get('/users/:id/avatar', async (req, res) => { 
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) { 
            throw new Error('No user or user avatar found')
        }
        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
     }
    catch (e) {
        res.status(404).send(e.message)
     }
})

module.exports = app
