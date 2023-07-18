const { client } = require('../../../connections');
const Book = require('../models/book');
async function getBooks(request, reply) {
  const { body } = await client.search({
    index: 'books',
    body: {
      query: {
        match_all: {},
      },
    },
  });
  const books = body.hits.hits.map((hit) => {
    const { _source } = hit;

    return new Book(_source.id, _source.title, _source.author, _source.publishedDate, _source.description, _source.price);
  });

  reply.send(books);
}

async function createBooks(request, reply) {
  const books = request.body;

  if (!Array.isArray(books)) {
    reply.status(400).send({ message: 'Invalid data type' });
    return;
  }

  const bulkBody = [];

  for (const book of books) {
    const { id, title, author, publishedDate, description, price } = book;

    if (!id || !title || !author || !publishedDate || !description || !price) {
      reply.status(400).send({ message: 'Missing required fields' });
      return;
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof author !== 'string' || typeof publishedDate !== 'string' || typeof description !== 'string' || typeof price !== 'number') {
      reply.status(400).send({ message: 'Invalid data types' });
      return;
    }

    bulkBody.push(
      { index: { _id: id } },
      { id, title, author, publishedDate, description, price }
    );
  }

  try {
    const { body } = await client.bulk({
      index: 'books',
      body: bulkBody,
    });

    reply.send(body);
  } catch (error) {
    console.error("createBooks", error);
    reply.status(500).send({ message: 'Internal server error' });
  }
}

async function retrieveBook(request, reply) {
  const { id } = request.params
  try {
    const { body } = await client.get({
      index: 'books',
      id,
    });

    const { _source } = body;

    const book = new Book(_source.id, _source.title, _source.author, _source.publishedDate, _source.description, _source.price);

    reply.send(book);
  } catch (error) {
    console.error("retrieveBook", error);

    if (error.statusCode === 404) {
      reply.status(404).send({ message: 'Book not found' });
      return;
    }

    reply.status(500).send({ message: 'Internal server error' });
  }
}

async function updateBook(request, reply) {
  const { id } = request.params;
  
  const { title, author, publishedDate, description, price } = request.body[0];
  if (!title && !author && !publishedDate && !description && !price) {
    reply.status(400).send({ message: 'At least one field must be updated' });
    return;
  }

  if (typeof title !== 'undefined' && typeof title !== 'string') {
    reply.status(400).send({ message: 'Invalid data type for title' });
    return;
  }

  if (typeof author !== 'undefined' && typeof author !== 'string') {
    reply.status(400).send({ message: 'Invalid data type for author' });
    return;
  }

  if (typeof publishedDate !== 'undefined' && typeof publishedDate !== 'string') {
    reply.status(400).send({ message: 'Invalid data type for publishedDate' });
    return;
  }

  if (typeof description !== 'undefined' && typeof description !== 'string') {
    reply.status(400).send({ message: 'Invalid data type for description' });
    return;
  }

  if (typeof price !== 'undefined' && typeof price !== 'number') {
    reply.status(400).send({ message: 'Invalid data type for price' });
    return;
  }

  const book = new Book(id, title, author, publishedDate, description, price);

  try {
    const { body } = await client.update({
      index: 'books',
      id,
      body: {
        doc: book,
      },
    });
    reply.send(body);
  }
  catch (error) {
    console.error("updateBook", error);
    reply.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = {
  getBooks,
  createBooks,
  retrieveBook,
  updateBook
};