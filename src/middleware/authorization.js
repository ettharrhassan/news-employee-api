const jwt=require('jsonwebtoken');
const Reporter='../db/models/users.js';

const Authorization = async (req, res, next) => {
    try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, "secretWord");
    const reporter = await Reporter.findById({ _id: decode._id });
    req.reporter = reporter;
    next();
    }
    catch(e){
        res.send({error:'Authorization Failed'})
    }
};

module.exports=Authorization