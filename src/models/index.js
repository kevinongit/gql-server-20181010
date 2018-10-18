import Sequelize from 'sequelize';

let sequelize;
if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
    });
} else {
    sequelize = new Sequelize(
        process.env.TEST_DATABASE || process.env.DATABASE,
        process.env.DATABASE_USER,
        process.env.DATABASE_PASSWORD,
        {
            dialect: 'postgres',
        },
    );
}

const models = {
    User: sequelize.import('./user'),
    Message: sequelize.import('./message'),
};

Object.keys(models).forEach(key => {
    if ('associate' in models[key]) {
        models[key].associate(models);
    }
});

export { sequelize };
export default models;



// let users = {
//     1: {
//         id: '1',
//         username: 'Me, Kevin',
//         messageIds: [],
//     },
//     2: {
//         id: '2',
//         username: 'Luke Skywalker',
//         messageIds: [],
//     },
// };

// let messages = {
//     1: {
//         id: '1',
//         text: 'Text Message one',
//         userId: '1',
//     },
//     2: {
//         id: '2',
//         text: 'On the planet.',
//         userId: '2',
//     },
//     3: {
//         id: '3',
//         text: 'Text Message Three',
//         userId: '1',
//     },
//     4: {
//         id: '4',
//         text: 'On the Earth.',
//         userId: '2',
//     },
// };

// export default { users, messages };