const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);

db.User.hasMany(db.Post);
db.Post.belongsTo(db.User); // user 모델과 post 모델은 1:N 관계에 있다. sequelize는 post 모델에 userId 컬럼을 추가한다.

db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); // post와 hashtag 모델은 N:M(다대다) 관계이다. 서로 여러 개를 가질 수 있다.
db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' }); //N:M 관계에서는 중간에 관계 테이블(여기서는 PostHashtag)가 발생한다.

db.User.belongsToMany(db.User, {
    foreignKey: 'followingId',
    as: 'Followers',
    through: 'Follow',
});
db.User.belongsToMany(db.User, { // 동일 테이블 내에서도 N:M관계가 가능하다. 예로 팔로잉 기능. user모델 사이에 다대다 관계까 발생할 수 있다.
    foreignKey: 'followerId',    // foreignKey 옵션으로 각각에 다른 이름을 넣어 두 모델 아이디를 구분한다.
    as: 'Followings',            // as 옵션은 sequelize가 JOIN 작업시 사용하는 이름이다. 이 이름을 바탕으로 getFollowings, addFollower 등의 메소드를 자동 추가.
    through: 'Follow',           // through 옵션으로 모델 이름을 따로 설정한다.
});

module.exports = db;
