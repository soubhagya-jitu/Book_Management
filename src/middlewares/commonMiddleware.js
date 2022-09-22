const jwt = require("jsonwebtoken")

//========================================== Authentication ============================================

const authentication = function(req,res,next){
    try{
        let token = req.headers["x-api-key"];
        if(!token) return res.status(401).send({status:false,msg:" token must be present "})
       
        let decodedToken = jwt.verify(token,"rass!@#512345ssar767")
        if(!decodedToken) return res.status(403).send({status:false,msg:"token is invalid"});
        req.decodedToken = decodedToken
        next()

    }catch(err){
        res.status(500).send({status:false,msg:err.message})
    }
}
module.exports ={authentication}