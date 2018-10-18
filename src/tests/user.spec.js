import { expect } from 'chai'

import * as userApi from './api'
import { inspect } from 'util'

describe('users', () => {
    describe('user(id: String!): User', () => {
        it('returns a user when user can be found', async () => {
            const expectedResult = {
                data: {
                    user: {
                        id: '1',
                        username: 'Mongorian',
                        email: 'mongorian@example.com',
                        role: null,
                    },
                },
            };
            const result = await userApi.user({id: '1'});

            expect(result.data).to.eql(expectedResult);
        });

        it('returns null when user cannot be found', async () => {
            const expectedResult = {
                data: {
                    user: null,
                },
            };
            const result = await userApi.user({id: '32'});

            expect(result.data).to.eql(expectedResult);
        })
    });

    describe('deleteUser(id: String!): Boolean!', () => {
        it('returns an error because only admin can delete a user', async() => {
            const {
                data: {
                    data: {
                        signIn: {token },
                    }
                },
            } = await userApi.signIn({
                login: 'Mongorian',
                password: 'abc1234',
            });

            console.log("+ token : " + token);

            const { data: { errors }, } = await userApi.deleteUser({ id: '1'}, token);

            expect(errors[0].message).to.eql('Not authorized.');
        });
    });
});