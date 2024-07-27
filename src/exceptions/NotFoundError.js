const ClientError = require('./ClientError');

class NotFoundError extends ClientError {
    constuctor(message) {
        super(message, 404);
        this.name ='NotFoundError';
    }
}

module.exports = NotFoundError;