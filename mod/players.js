const db = require('./database.js').players;
const fs = require('fs');

db.loadDatabase();

exports.getPlayers = (req, res) => {
    db.find({}, (err, playerList) => {
        if (err)
            res.sendStatus(500);
        res.setHeader('Content-Type', 'application/json');
        return res.json({
            players: playerList
        });
    });
};
exports.addPlayer = (req, res) => {
    let user = req.body;
    delete user._id;

    if (req.file) user.avatar = req.file.filename;

    db.insert(user, (err, newUser) => {
        if (err) return res.sendStatus(500);
        return res.status(200).json({
            id: newUser["_id"]
        });
    });
};
exports.updatePlayer = (req, res) => {
    let user = req.body;
    let userId = user._id;
    delete user._id;

    if (req.file) user.avatar = req.file.filename;

    function removeAvatarFile(err, playerList) {
        if (err) return res.sendStatus(500);
        if (!playerList[0]) return res.sendStatus(200);

        if (fs.existsSync('./public/storage/' + playerList[0].avatar)) fs.unlinkSync('./public/storage/' + playerList[0].avatar);

        db.update({
            _id: userId
        }, {
            $set: {
                sid: user.sid,
                real_name: user.real_name,
                displayed_name: user.displayed_name,
                country_code: user.country_code,
                team: user.team,
                avatar: user.avatar
            }
        }, {}, (err, numReplaced) => {
            if (err) return res.sendStatus(500);
            return res.sendStatus(200);
        });
    }


    db.find({
        _id: userId
    }, removeAvatarFile);
};
exports.deletePlayer = (req, res) => {
    let userId = req.body.userId;

    function removePlayer(err, playerList) {
        if (err) return res.sendStatus(500);
        if (!playerList[0]) return res.sendStatus(200);

        if (fs.existsSync('./public/storage/' + playerList[0].avatar)) fs.unlinkSync('./public/storage/' + playerList[0].avatar);

        db.remove({
            _id: userId
        }, {}, (err, numRemoved) => {
            if (err || numRemoved != 1) return res.sendStatus(500);
            return res.sendStatus(200);
        });
    }

    db.find({
        _id: userId
    }, removePlayer);
};

exports.deleteAvatar = (req, res) => {
    let userId = req.body.userId;

    function removeAvatarFile(err, playerList) {
        if (err) return res.sendStatus(500);
        if (!playerList[0]) return res.sendStatus(200);

        if (fs.existsSync('./public/storage/' + playerList[0].avatar)) fs.unlinkSync('./public/storage/' + playerList[0].avatar);

        db.update({
            _id: userId
        }, {
            $set: {
                logo: null
            }
        }, {}, (err, numReplaced) => {
            if (err) return res.sendStatus(500);
            return res.sendStatus(200);
        });
    }
    db.find({
        _id: userId
    }, removeAvatarFile);
};

exports.render = (req, res) => {
    return res.render('players', {
        ip: address,
        port: hud_port,
        flags: getFlags()
    });
};