import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import "dotenv/config";
import http from "http";
import DataLoader from 'dataloader'

import schema from "./schema";
import resolvers from "./resolvers";
import models, { sequelize } from "./models";
import loaders from './loaders'

const app = express();
app.use(cors());

const getMe = async req => {
  const token = req.headers["x-token"];

  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError("Your session expired. Sign in again.");
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models,
        user: new DataLoader(keys =>
            loaders.user.batchUsers(keys, models),
        ),
      };
    }
    if (req) {
      const me = await getMe(req);
      return {
        models,
        me,
        secret: process.env.SECRET,
        loaders: {
            user: new DataLoader(keys => loaders.user.batchUsers(keys, models)),
        }
      };
    }
  }
});

server.applyMiddleware({ app, path: "/graphql" });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const isTest = !!process.env.TEST_DATABASE;
const isProduction = !!process.env.DATABASE_URL;
const port = process.env.PORT || 8000;
sequelize.sync({ force: isTest || isProduction }).then(async () => {
  if (isTest || isProduction) {
    createUsersWithMessages(new Date());
  }
  httpServer.listen({ port }, () => {
    console.log("🚀 server on http://localhost:${port}/graphql");
  });
});

const createUsersWithMessages = async date => {
  await models.User.create(
    {
      username: "Mongorian",
      email: "mongorian@example.com",
      password: "abc1234",
      messages: [
        {
          text: "There was a first Mongorian",
          createdAt: date.setSeconds(date.getSeconds() + 1)
        }
      ]
    },
    {
      include: [models.Message]
    }
  );

  await models.User.create(
    {
      username: "holygrain",
      email: "holygrain@example.com",
      password: "abcd1234",
      messages: [
        {
          text: "Happy to release",
          createdAt: date.setSeconds(date.getSeconds() + 1)
        },
        {
          text: "Published a complete",
          createdAt: date.setSeconds(date.getSeconds() + 1)
        }
      ]
    },
    {
      include: [models.Message]
    }
  );

  await models.User.create(
    {
      username: "kevin",
      email: "nait90@gmail.com",
      password: "hello1234",
      role: "ADMIN",
      messages: [
        {
          text: "Hi, Everyone",
          createdAt: date.setSeconds(date.getSeconds() + 1)
        },
        {
          text: "Winter is coming.",
          createdAt: date.setSeconds(date.getSeconds() + 1)
        }
      ]
    },
    {
      include: [models.Message]
    }
  );
};
