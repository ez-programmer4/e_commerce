const AppError = require('./../utilities/AppError');

const handleCastError = (err) => {
    const message = `Invalid ${err.path} = ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateError = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data: ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token, please log in again', 401);
const handleJWTExpiredError = () => new AppError('Your token has expired, please log in again', 401);

const sendDevError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendProdError = (err, res) => {
    if(err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        console.error('ERROR 💥', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong, please try again later'
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    
    if(process.env.NODE_ENV === 'development') {
        sendDevError(err, res);
    } else if(process.env.NODE_ENV === 'production') {
        let error = {...err};
        error.message = err.message;  // Ensure message is copied
        
        if(error.name === 'CastError') {
            error = handleCastError(error);
        }
        if(error.code === 11000) {
            error = handleDuplicateError(error);
        }
        if(error.name === 'ValidationError') {
            error = handleValidationError(error);
        }
        if(error.name === 'JsonWebTokenError') {
            error = handleJWTError();
        }
        if(error.name === 'TokenExpiredError') {
            error = handleJWTExpiredError();
        }
        
        sendProdError(error, res);
    }
};