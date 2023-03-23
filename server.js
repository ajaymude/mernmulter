const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const env = require('dotenv').config()
const multer  = require('multer')
const mongoose = require('mongoose')
// const upload = multer({ dest: 'uploads/' })


//db connection 
const dbconnection = async ()=>{
  try {
    mongoose.connect('mongodb+srv://ravimude:ajay7777@cluster0.thi8yzl.mongodb.net/fileupload?retryWrites=true&w=majority')
    console.log('db is connected')
  } catch (error) {
    
  }
}
dbconnection()

const imgschema = mongoose.Schema({ 
  imgpath:{
    type:String
  }
})

const imgModel = mongoose.model('images', imgschema)



const storage = multer.diskStorage({ 
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

const upload = multer({ storage: storage })



// middlewares

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(express.static('build'))
app.use('/uploads', express.static('uploads'))
// route


app.post('/', upload.single('photo'),async (req ,res)=>{ 
 try {
  const img = await imgModel.create({imgpath:req.file.path}  )
  const data =  await imgModel.find().sort({_id:-1})
    console.log(img)
  
      res.send({data:data})
  
 } catch (error) {
  res.send('insert the photo')
  
 }
})

app.get('/',async (req ,res)=>{ 
 const data =  await imgModel.find().sort({_id:-1})


    res.send({data:data})
})





//listenig 
app.listen(8000, ()=>{ console.log('server is runnig on port  ckeck')})