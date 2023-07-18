// const routes = require('./book');
// async function registerRoutes(fastify, options) {
//     fastify.register(routes);
// }
// module.exports = registerRoutes;
// const routes = require('./book');

// module.exports = async (fastify, options) => {
//     fastify.register(routes);
// };
const bookRoutes = require('./book');

module.exports = {
  bookRoutes,
};

