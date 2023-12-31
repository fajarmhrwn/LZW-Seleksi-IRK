const admin = require('../config/firebase-config');

class Middleware{
    async decodeToken(req, res, next){
        const token = req.headers.authorization.split(' ')[1];
        try{
            const decodeValue = await  admin.auth().verifyIdToken(token)
            console.log(decodeValue);
            if(decodeValue){
                return next();
            }
    
            return res.status(401).json({
                message: "Unauthorized"
            })

        }catch(error){
            return res.status(401).json({
                message: "Internal Error"
            })
        }
    }
}

module.exports = new Middleware();