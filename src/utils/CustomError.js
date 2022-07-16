// create a custom error class with status code and message
class CustomError extends Error {
    constructor(statusCode, message) {
        super(message)
        this.statusCode = statusCode
    }
}

exports.customError = ({ message, statusCode }) => {
    statusCode = statusCode || 500
    message = message || 'Something went wrong'
    return new CustomError(statusCode, message)
}

module.exports = CustomError
