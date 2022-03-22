const imageFilter = function(req, file, cb) 
{
        // Accept images only
	if (!file.originalname.match(/\.(jpg|JPG|png|PNG)$/)) 
	{
		req.fileValidationError = 'Solo se aceptan ficheros .jpg o .png';
	        return cb(new Error('Solo se aceptan ficheros .jpg o .png'), false);
	}
	cb(null, true);
};

exports.imageFilter = imageFilter;
