
const fastify = require('fastify')();
const { server } = require('../../config');
const { bookRoutes } = require('../../addons/book');
class Server {
    // Constructor
    constructor() {
        // Set the port and host
        this.port = server.port;
        this.host = server.host;
    }

    async start() {
        try {
            fastify.listen({ port: this.port, host: this.host }, (err) => {
                if (err) {
                    fastify.log.error(err)
                    process.exit(1)
                }
                console.log(`Server running on port http://${this.host}:${fastify.server.address().port}`);
            })
            // Routes
            fastify.post('/createbooks', bookRoutes.createBooks);
            fastify.get('/getbook/:id', bookRoutes.retrieveBook);
            fastify.get('/books', bookRoutes.getBooks);
            fastify.put('/updatebook/:id', bookRoutes.updateBook);
        } catch (err) {
            console.log(err);
        }
    }
}
module.exports = Server;