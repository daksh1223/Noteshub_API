const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const cors = require('cors');
const depthLimit = require('graphql-depth-limit');
const { createComplexityLimitRule } = require('graphql-validation-complexity');

const resolvers = require('./GraphQL/index');
const db = require('./db');
const typeDefs = require('./schema');
const Models = require('./Models/index');

require('dotenv').config();
// Run our server on a port specified in our .env file or port 4000
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

// Provide resolver functions for our schema fields
const app = express();
app.use(helmet());
app.use(cors());

const token_check = token => {
  if (!token) return false;
  return jwt.verify(token, process.env.JWT_SECRET);
};
// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules:[depthLimit(5),createComplexityLimitRule(1000)],
  context: ({ req }) => {
    const token = req.headers.authorization;
    const user = token_check(token);
    return { Models, user };
  }
});
// Apply the Apollo GraphQL middleware and set the path to /api
server.applyMiddleware({ app, path: '/api' });
db.connect(DB_HOST, () => {
  console.log('Database connection established');
  app.listen({ port }, () =>
    console.log(
      `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
    )
  );
});
