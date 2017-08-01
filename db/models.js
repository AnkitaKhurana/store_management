const Sequelize = require('sequelize');

const db = new Sequelize('store', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql'
});

const Footwear = db.define('footwear', {
    f_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category: Sequelize.STRING,
    size: Sequelize.STRING,
    colour: Sequelize.STRING,
    brand : Sequelize.STRING,
    date_brought : Sequelize.DATE,
    date_sold : Sequelize.DATE,
    imgurl : Sequelize.STRING,
    type  : Sequelize.STRING,
    article_no : Sequelize.STRING,
    quantity : {type: Sequelize.INTEGER,allowNull: false },
    material : Sequelize.STRING

});
const User = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email : Sequelize.STRING,
    username: Sequelize.STRING,
    password: Sequelize.STRING
});

db.sync()
    .then(() => {
        console.log("Database Synchronised");
    })
    .catch((err) => {
        console.log("Error setting up Database");
        console.error(err);
    });
module.exports = {
    User,Footwear

    };


