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
//   if (isTest || isProduction) {
if (true) {
    createUsersWithMessages(new Date());
  }
  httpServer.listen({ port }, () => {
    console.log(`🚀 server on http://localhost:${port}/graphql`);
  });
});

const createUsersWithMessages = async date => {
  const now = Date.now();
  await models.User.create(
    {
      username: "kevin",
      email: "kevin@example.com",
      password: "abc1234",
      avatarUrl: "http://52.78.124.193/tmp/assets/image1.png",
      description: "kevin은 Sentencer를 만들고 운영하고 있습니다. 영어에 한맺힌 1인입니다. You're not alone!",
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
          likes: 0,
          createdAt: new Date(now - 120000),
        },
        {
            sentenceLang: "en",
            category: "idiom",
            from: "leemario",
            keyPhrase: "all ears",
            keyPhraseMeaning: "집중해서 (귀기울여) 듣는다.",
            sentence: "Tell me anything about her. I'm all ears.",
            sentenceMeaning: "그녀에 대해 아무거라도 얘기해봐. 나 집중해서 듣고 있어.",
            likes: 932,
            createdAt: new Date(now - 104000000),
        },
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
      avatarUrl: "http://52.78.124.193/tmp/assets/image2.png",
      description: "aaron은 기분파입니다. 바이오가 오락가락... 외모에 다르게 여성스러운 섬세함과 부드러움이 숨어 있습니다.",
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
            likes: 23,
            createdAt: new Date(now + 1),
        },
        {
            sentenceLang: "en",
            category: "idiom",
            from: "aaron",
            keyPhrase: "a piece of cake",
            keyPhraseMeaning: "식은죽 먹기",
            sentence: "I thought the final exam to be very difficult, but it turned out a piece of cake.",
            sentenceMeaning: "기말 고사가 굉장히 어려울 것 같았는데, 막상 보니 식은 죽 먹기였어.",
            likes: 2,
            createdAt: new Date(now - 10200000),
        },
        {
            sentenceLang: "en",
            category: "idiom",
            from: "aaron",
            keyPhrase: "hit the sack",
            keyPhraseMeaning: "잠자러 가다.",
            sentence: "I'm so tired, it's time for me to hit the sack",
            sentenceMeaning: "너무 피곤해, 나 자야할 시간이야.",
            likes: 156,
            createdAt: new Date(now + 1),
        },
        {
            sentenceLang: "en",
            category: "idiom",
            from: "aaron",
            keyPhrase: "face the music",
            keyPhraseMeaning: "마주하다, 직면하다, (자신의 행동에 대해) 비난/벌을 받다. 책임을 지다.",
            sentence: "If she lied to me, then she'll just have to face the music.",
            sentenceMeaning: "만약 그녀가 나에게 거짓말 했다면, 그녀는 책임져야 할 것이다.",
            likes: 0,
            createdAt: new Date(now - 300000),
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
      avatarUrl: "http://52.78.124.193/tmp/assets/image3.png",
      description: "Chrisu는 미국에서 몆년 살다가 왔지요. Sentencer에 대한 문장들을 검수하고 등록합니다. 전공이 뭔지는 아무도 모릅니다..",
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
            likes: 10,
            createdAt: new Date(now - 9000000),
        },
        {
            sentenceLang: "en",
            category: "idiom",
            from: "chrisu",
            keyPhrase: "right as rain",
            keyPhraseMeaning: "(몸 상태 등이) 완벽한, 건강한",
            sentence: "All I want is a couple days off and I will be right as rain.",
            sentenceMeaning: "며칠 정도만 쉬고 나면, 아주 건강해 질거야.",
            likes: 43,
            createdAt: new Date(now + 1),
        },
        {
            sentenceLang: "en",
            category: "idiom",
            from: "chrisu",
            keyPhrase: "on the ball",
            keyPhraseMeaning: "일이 돌아가는 사정을 훤휘 꿰고 있다. 잘한다.",
            sentence: "The new puclicity manager is really on the ball.",
            sentenceMeaning: "새 홍보부장은 일이 돌아가는 사정을 훤히 꽤고 있다.",
            likes: 120,
            createdAt: new Date(now - 5000000),
        },
      ]
    },
    {
      include: [models.Message]
    }
  );

  await models.User.create(
    {
      username: "erik",
      email: "leemario@example.com",
      password: "hello1234",
      avatarUrl: "http://52.78.124.193/tmp/assets/image4.png",
      description: "Erik은 매서운 눈을 갖고 있는 전직 QA입니다. 술을 좋아하고, 운동을 좋아하고... 음 주로 노는건 다 좋아한다네요...",
      role: "normal",
      point: 20,
      messages: [
        {
            sentenceLang: "en",
            category: "idiom",
            from: "leemario",
            keyPhrase: "in a nutshell",
            keyPhraseMeaning: "간략하고 명료하게 (말하다.) / 요약하면",
            sentence: "In a nutshell, he is just bankrupt.",
            sentenceMeaning: "간단히 말하면, 그는 파산했다",
            likes: 543,
            createdAt: new Date(now - 200000000),
        },
        {
            sentenceLang: "en",
            category: "idiom",
            from: "leemario",
            keyPhrase: "once in a bluemoon",
            keyPhraseMeaning: "극히 드물게",
            sentence: "He visits his uncle once in a blue moon",
            sentenceMeaning: "그는 그의 삼촌을 자주 찾아 뵙지 않는다.",
            likes: 239,
            createdAt: new Date(now - 13500000),
        },
      ]
    },
    {
      include: [models.Message]
    }
  );

};
