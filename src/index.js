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
  introspection: true,
  typeDefs: schema,
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models, sequelize,
        user: new DataLoader(keys =>
            loaders.user.batchUsers(keys, models),
        ),
      };
    }
    if (req) {
      const me = await getMe(req);
      return {
        models, sequelize,
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
    console.log(`🚀 server on http://localhost:${port}/graphql`);
  });
});

const createUsersWithMessages = async date => {
  await models.User.create(
    {
      username: "kevin",
      email: "kevin@example.com",
      password: "abc1234",
      role: "admin",
      point: 1000,
      messages: [
        {
          sentenceLang: "en",
          category: "idiom",
          from: "kevin",
          keyPhrase: "apple of one's eye",
          keyPhraseMeaning: "apple of one's eye : 매우 소중한 것/사람",
          sentence: "His daughter is the apple of his eye",
          sentenceMeaning: "그의 딸은 그에게 있어서 굉장히 소중한 사람이다.",
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
      username: "aaron",
      email: "aaron@example.com",
      password: "abcd1234",
      role: "normal",
      point: 0,
      messages: [
        {
            sentenceLang: "en",
            category: "idiom",
            from: "aaron",
            keyPhrase: "call it a day",
            keyPhraseMeaning: "하루를 마무리하다.",
            sentence: "It's already 6 o'clock. Let's call it a day.",
            sentenceMeaning: "벌써 6시야. 자 하루를 마무리 합시다.",
            createdAt: date.setSeconds(date.getSeconds() + 1)
        },
        {
            sentenceLang: "en",
            category: "idiom",
            from: "aaron",
            keyPhrase: "a piece of cake",
            keyPhraseMeaning: "식은죽 먹기",
            sentence: "I thought the final exam to be very difficult, but it turned out a piece of cake.",
            sentenceMeaning: "기말 고사가 굉장히 어려울 것 같았는데, 막상 보니 식은 죽 먹기였어.",
            createdAt: date.setSeconds(date.getSeconds() + 1)
        },
        {
            sentenceLang: "en",
            category: "idiom",
            from: "aaron",
            keyPhrase: "hit the sack",
            keyPhraseMeaning: "잠자러 가다.",
            sentence: "I'm so tired, it's time for me to hit the sack",
            sentenceMeaning: "너무 피곤해, 나 자야할 시간이야.",
            createdAt: date.setSeconds(date.getSeconds() + 1)
        },
        {
            sentenceLang: "en",
            category: "idiom",
            from: "aaron",
            keyPhrase: "face the music",
            keyPhraseMeaning: "마주하다, 직면하다, (자신의 행동에 대해) 비난/벌을 받다. 책임을 지다.",
            sentence: "If she lied to me, then she'll just have to face the music.",
            sentenceMeaning: "만약 그녀가 나에게 거짓말 했다면, 그녀는 책임져야 할 것이다.",
            createdAt: date.setSeconds(date.getSeconds() + 1)
        },
      ]
    },
    {
      include: [models.Message]
    }
  );

  await models.User.create(
    {
      username: "chrisu",
      email: "chrisu@example.com",
      password: "hello1234",
      role: "normal",
      point: 20,
      messages: [
        {
            sentenceLang: "en",
            category: "idiom",
            from: "chrisu",
            keyPhrase: "in hot water",
            keyPhraseMeaning: "곤란한 상황에 처해 있다.",
            sentence: "he stole a car and is in hot water with the law.",
            sentenceMeaning: "그는 차를 훔쳐 지금 법적 곤경에 빠져있다.",
            createdAt: date.setSeconds(date.getSeconds() + 1)
        },
        {
            sentenceLang: "en",
            category: "idiom",
            from: "chrisu",
            keyPhrase: "in hot water",
            keyPhraseMeaning: "곤란한 상황에 처해 있다.",
            sentence: "he stole a car and is in hot water with the law.",
            sentenceMeaning: "그는 차를 훔쳐 지금 법적 곤경에 빠져있다.",
            createdAt: date.setSeconds(date.getSeconds() + 1)
        },
        {
            sentenceLang: "en",
            category: "idiom",
            from: "chrisu",
            keyPhrase: "on the ball",
            keyPhraseMeaning: "일이 돌아가는 사정을 훤휘 꿰고 있다. 잘한다.",
            sentence: "The new puclicity manager is really on the ball.",
            sentenceMeaning: "새 홍보부장은 일이 돌아가는 사정을 훤히 꽤고 있다.",
            createdAt: date.setSeconds(date.getSeconds() + 1)
        },
      ]
    },
    {
      include: [models.Message]
    }
  );

};
