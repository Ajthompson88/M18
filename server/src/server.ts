import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import { resolvers, typeDefs } from './schemas/index.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { authenticateToken } from './services/auth.js';

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const startApolloServer = async () => {
  await server.start();
  await db
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use("/graphql", expressMiddleware(server as any, 
    {
      context: authenticateToken as any
    }
 
  ));

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
}
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
}

startApolloServer();
