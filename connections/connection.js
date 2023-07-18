const { Client } = require('@elastic/elasticsearch')
const { elastic } = require('../config');
const client = new Client({
  node: 'https://localhost:9200',
  auth: {
    username: 'elastic',
    password: '7*oEKqGdRz6WSNM93FKt'
  },
  ssl: {
    ca: process.env.elasticsearch_certificate,
    rejectUnauthorized: false,
  },
})
module.exports = { client }
