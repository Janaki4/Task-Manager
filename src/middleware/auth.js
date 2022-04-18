const jwt = require('jsonwebtoken')
const User = require('../modals/user')
 


const auth = async (req,res,next) => { 
   
    try { 
        const token = req.header('Authorization').replace('Bearer ', '')
         
        const decrypt = jwt.verify(token, process.env.JWT_SECRET)
        
        const user = await User.findOne({ _id:decrypt.id, "tokens.token": token })

        if (!user ) { 
            return new Error('error found, User is not authenticated ')
        }
        req.user = user
        req.token= token
        next()
    }
    catch (e) { 
        res.status(500).send(e)
    }

}


module.exports = auth