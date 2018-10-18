var messages = {
    1: {
        id: '1',
        text: 'Text Message one',
        userId: '1',
    },
    2: {
        id: '2',
        text: 'On the planet.',
        userId: '2',
    },
    3: {
        id: '3',
        text: 'Text Message Three',
        userId: '1',
    },
    4: {
        id: '4',
        text: 'On the Earth.',
        userId: '2',
    },
};

var r = messages.filter(message => message.id === '1');

console.log (r);
