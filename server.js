const express = require('express')
const app = express()
const port = 3000
const hbse = require('express-handlebars')
const path = require('path')
const uuid = require('uuid')
const jimp = require('jimp')

//handlebars
app.engine('hbs', hbse.engine(
  {
    extname:'hbs',
    defaultLayout:'main',
  }))

app.set('view engine','hbs')
app.set('views',path.join(__dirname,'views'))

//middleware

app.use('/bootstrap',express.static(path.join(__dirname,'node_modules/bootstrap/dist/css')))
app.use('/bootstrapjs',express.static(path.join(__dirname,'node_modules/bootstrap/dist/js')))
app.use('/assets',express.static(path.join(__dirname,'assets')))
app.use(express.urlencoded({ extended: true }))



//rutas 

app.get('/', (req, res) =>{
  res.render('dash',)
  
})

// mostrar img
app.get('/:id', (req, res) =>{

    // se muestra la img
  res.render('img',{id : req.params.id})
    
  })


//procesar img
app.post('/process', async (req, res) => {
    res.setHeader('Content-Type', 'image/png')
    //obtenemos la url del formulario de dash
    try {
        const { url } = req.body
        
        // Procesar la imagen
        const image = await jimp.read(url)
        //le aplicamos los cambios a la imagen y la guardamos
        let imgID = uuid.v4().slice(0, 6)
        let imgpath = `assets/imgs/${imgID}.jpg`
        
       

        await image.grayscale().resize(350, jimp.AUTO).writeAsync(imgpath)
        res.redirect(`/${imgID}`)
        //enviamos respuesta al servidor
        console.log(`Imagen procesada ${imgID}.jpg`)
    } catch (error) {
        console.error('Error al procesar la imagen:', error)
        res.status(500).send('Error al procesar la imagen')
    }})





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
