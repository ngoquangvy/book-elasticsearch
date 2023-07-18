// module.exports = {
//     routes: require('./routes')
// }
// const book = require('./routes');

// module.exports = async (fastify, options) => {
//     fastify.register(book);
// };

const { bookRoutes } = require('./routes');

module.exports = {
  bookRoutes,
};
