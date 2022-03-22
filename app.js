var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var expressValidator = require("express-validator");
var multer = require("multer");
const helpers = require('./public/helpers');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));


// Middleware para el parseo de req.body
app.use(bodyParser.urlencoded( {extended: false}));
app.use(bodyParser.json());


var storage = multer.diskStorage(
{
    // definir restricciones para que los ficheros subidos se guarden en la carpeta public/imgs/
	// tamaño máximo de los ficheros: 2MB
	// sólo se admiten ficheros jpg o png
    // el nombre del fichero que se guarda debe coincidir con el que se envíab
	
	destination: function(req, file, cb)
	{
		cb(null, "public/imgs/");
	},

	filename: function(req, file, cb) 
	{
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}



});

var upload = multer(
{ 
	storage: storage,
	limits: 
	{
		fileSize: 2048 * 1024
	}

});

var pedido = upload.array('fileselect');

app.get("/", function(req, res)
{
	res.render("index.html");
});

app.post("/pedido/add", (req, res) => 
{
	console.log("aajanaj");
	console.log(req.body);
	var files
	let pedido = multer({ storage: storage, limits: 2048 * 1024, fileFilter: helpers.imageFilter }).array(files, 3);

	pedido(req, res, (err) => 
	{
		if (req.sifleValidationError)
		{
			return res.send(
			{
				"success": false,
				"error": req.fileValidationError
			})
		}
		else if (err instanceof multer.MulterError)
		{
			return res.send( 
			{
				"success":false,
				"error": err
			})
		}
		else if (err)
		{
			return res.send(
			{
				"success": false,
				"error": err
			})
		}
		else
		{
			return res.send(
			{
				"success": true,
				"ruta": req.files,
				"data": req.body
			})
		}
		res.render("index.ejs");

    // en caso de error, devolver un objeto JSON
    // { sucess:false, error: err  }  

    // en caso de éxito, devolver un objeto JSON que contenga: success:true, la ruta a los ficheros
    // subidos y los valores recibidos en cada campo del formulario POST
	
    })
});


app.listen(3000, function() 
{
    console.log("Servidor lanzado en el puerto 3000");
});
