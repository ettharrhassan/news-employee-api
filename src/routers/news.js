const express=require('express')
const News=('../db/models/news')
const router=express.Router()
const authorization=require('../middleware/authorization.js')
const multer  = require('multer');

router.post('/page/news', authorization, async(req, res)=> {
    try{

        const day = new Intl.DateTimeFormat("en-GB", {
            weekday: "short",
            day: "2-digit",
            hour: "numeric",
            hour12: true,
            minute: '2-digit'
        }).format(Date.now());

        const news = new News({...req.body,reporter:req.reporter._id, reporterName:req.reporter.name, reported_on: day});
        await news.save() ;
        res.send(news);
    }
    catch(e){
        res.send(e.message)
    }
});

router.get('/page/news', authorization, async(req, res)=> {
    try{
        await req.reporter.populate('newsRelation');
        res.send(req.reporter.newsRelation);
    }
    catch(e){
        res.send(e.message);
    }
});


router.patch('/page/news', authorization, async(req, res)=> {
    try{
        const title = req.body.title;
        const news = await News.findOneAndUpdate({title, reporter:req.reporter._id}, req.body,{
            new: true,
            runValidators: true
        });
        if(!news){
            return res.send('news not found')
        };
        res.send(news);
    }
    catch(e){
        res.send(e.message)
    }
});


router.delete('/page/news/', authorization, async(req, res)=> {
    try{
        const title = req.body.title;
        const news = await News.findOneAndDelete({title, reporter:req.reporter._id});
        if(!news){
            return res.send('news not found');
        }
        res.send('Deleted Successfully')
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

router.post('/page/news/image/:id', authorization, upload.single('avatar'), async(req, res) => {
    try{
        const _id = req.params.id;
        const news = await News.findOne({_id, reporter:req.reporter._id});
        news.image = req.file.buffer;
        await news.save();
        if(!news){
            return res.send('Undefined News')
        };
        res.send(news)
    }
    catch(e){
        res.send(e.message)
    }
});

module.exports = router;