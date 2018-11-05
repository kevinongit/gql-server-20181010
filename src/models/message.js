
const message = (sequelize, DataTypes) => {
    const Message = sequelize.define('message', {
        category: {
            type: DataTypes.STRING,
            validate: { notEmpty: true },
        },
        keyword : {
            type: DataTypes.STRING,
        },
        orgAuthor: {
            type: DataTypes.STRING,
        },
        from: {
            type: DataTypes.STRING,
            validate: { notEmpty: true },
        },
        keyPhrase: {
            type: DataTypes.STRING,
        },
        keyPhraseMeaning: {
            type: DataTypes.STRING,
            validate: { notEmpty: true },
        },
        sentence: {
            type: DataTypes.STRING,
            validate: { notEmpty: true },
        },
        sentenceMeaning: {
            type: DataTypes.STRING,
            validate: { notEmpty: true },
        },
        sentenceLang: {
            type: DataTypes.STRING,
            validate: { notEmpty: true },
        },
        likes: {
            type: DataTypes.INTEGER,
        },
        favored: {
            type: DataTypes.INTEGER,
        },
        difficulty: {
            type: DataTypes.INTEGER,
        }
    });

    Message.associate = models => {
        Message.belongsTo(models.User);
    };

    return Message;
};

export default message;