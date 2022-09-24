const express=require('express');
const app=express();
const port=process.env.PORT || 3000;
const bcryptjs = require('bcryptjs')
require('./db/mongoose')
app.use(express.json())


const newsRouter=require('../src/routers/news')
const reporterRouter=require('./routers/reporters')


app.use(newsRouter)
app.use(reporterRouter)


const passwordFunction=async()=>{
    const password=''
    const hashedPassword=await bcryptjs.hash(password,8)
    const compare=await bcryptjs.compare('',hashedPassword)
}
passwordFunction();

app.listen(port,()=>{
    console.log('Server Is Running')
})