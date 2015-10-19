var db = require('monk')(process.env.PARASPLAT_SESSION_MONGO_DB);

var users = db.get('users');

module.exports = users;
