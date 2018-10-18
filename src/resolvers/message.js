import { combineResolvers } from "graphql-resolvers";
import Sequelize from 'sequelize'
import { isAuthenticated, isMessageOwner } from "./authorization";

import pubsub, { EVENTS } from '../subscription'

const toCursorHash = string => Buffer.from(string).toString('base64');
const fromCursorHash = string => Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    messages: async (parent, {cursor, limit=100}, { models }) => {
      const cursorOptions = cursor
        ? {
            where: {
                createdAt: {
                    [Sequelize.Op.lt]: fromCursorHash(cursor),
                },
            },
          }
        : {};
      const messages = await models.Message.findAll({
          order: [['createdAt', 'DESC']],
          limit: limit + 1,
          raw: false,
          ...cursorOptions,
      });

      const hasNextPage = messages.length > limit;
      const edges = hasNextPage ? messages.slice(0, -1) : messages;

      return {
          edges,
          pageInfo: {
              hasNextPage,
              endCursor: toCursorHash((messages[messages.length - 1].createdAt).toString()),
          }
      }
    },

    message: async (parent, { id }, { models }) => {
      return await models.Message.findById(id);
    }
  },

  Mutation: {
    createMessage: combineResolvers(
      isAuthenticated,
      async (parent, { text }, { me, models }) => {
        const message = await models.Message.create({
          text,
          userId: me.id
        });
        pubsub.publish(EVENTS.MESSAGE.CREATED, {
            messageCreated: { message },
        });

        return message;
      }
    ),
    deleteMessage: combineResolvers(
        isAuthenticated,
        isMessageOwner,
        async (parent, { id }, { models }) => {
          return await models.Message.destroy({ where: { id } });
        }
    ),
    updateMessage: async (parent, { id, text }, { models }) => {
      return await models.Message.update(
        {
          text: text
        },
        {
          where: { id: id }
        }
      );
    },
  },
  Message: {
    user: async (message, args, { loaders }) => {
      return await loaders.user.load(message.userId);
    }
  },

  Subscription: {
      messageCreated: {
          subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
      },
  },
};
