const express=require('express')
const Reporter=require('../db/models/reporters')
const router=express.Router()
const authorization=require('../middleware/authorization.js')
const multer  = require('multer');

router.post('/signup', async(req, res) => {
    try{
        const reporter = new Reporter(req.body);
        await reporter.save();
        const token = reporter.generateToken();
        res.send({reporter,token});
    }
    catch(e){
        res.send(e.message);
    }
});

router.post('/page', authorization, async(req, res) => {
    try{
    const reporter = await Reporter.findByCredentials(req.body.email, req.body.password);
    const token = reporter.generateToken();
    res.send({reporter,token});
    }
    catch(e){
    res.send(e.message);
    }
});

router.patch('/page', authorization, async(req, res)=> {
    try{
        const _id = req.reporter._id; 
        const reporter = await Reporter.findByIdAndUpdate(_id, req.body,  {
            new: true,
            runValidators: true
        });
        if(!reporter) return res.send('reporter not found');
        res.send(reporter)
    }
    catch(e){
        res.send(e.message)
    }
});


router.delete('/page', authorization, async(req, res)=> {
    try{
        const _id = req.reporter._id; 
        const reporter = await Reporter.findByIdAndDelete(_id);
        console.log(reporter);
        if(!reporter) return res.send('reporter not found');
        res.send("Entery deleted!")
    }
    catch(e){
        res.send(e.message)
    }
});

const upload = multer({
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
            return cb(new Error('Please upload an image'))
        };
        cb(null, true); 
    }
});

router.post('/page/image', authorization, upload.single('avatar'), async(req, res) => {
    try{
        req.reporter.image = req.file.buffer;
        await req.reporter.save()
        res.send('Uploaded Successfully')
    }
    catch(e){
        res.send(e.message)
    }
})

module.exports=router;