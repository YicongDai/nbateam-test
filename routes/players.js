var Players= require('../models/players');
let express = require('express');
let router = express.Router();
// let mongoose = require('mongoose');
// var mongodbUri ='mongodb://YicongDai:dycwjh123@ds249372.mlab.com:49372/nbateamdb';
// mongoose.connect(mongodbUri ,{useNewUrlParser:true});
// // mongoose.connect('mongodb://localhost:27017/NBAteamdb',{useNewUrlParser:true});
//
// let db = mongoose.connection;
// db.on('error', function (err) {
//     console.log('Unable to Connect to [ ' + db.name + ' ]', err);
// });
//
// db.once('open', function () {
//     console.log('Successfully Connected to [ ' + db.name + ' ]');
// });
//find all players' information
router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');
    Players.find(function(err, players){
        if (err)
            res.send(err);

        res.send(JSON.stringify(players,null,5));
    });
};

// find a specific player's information by id
router.findOne = (req, res) => {

    res.setHeader('Content-Type', 'application/json');
    Players.findOne({"name": req.params.name}, function (err, player) {
        if (err||player==null){
            res.status(404);
            res.json({message: 'Player NOT Found! Please check the right name', errmsg: err});
        }

        else
            res.send(JSON.stringify(player, null, 5));

    });
}


//find the team information related to a player
router.findTeamInformation= (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Players.findOne({"_id": req.params.id}).populate({path:'teamId',select: 'name city -_id'}).exec(function (err, info) {
        if (err)
            res.send(err);

        else
            res.json({ message: 'Player Successfully find team!',data:info})

    })
};

//fuzzy search
router.findOneByName= (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var keyword = req.params.name;

    var _filter={
        $or: [

            {name: {$regex: keyword, $options: '$i'}},

        ]
    }
    var count = 0
    Players.countDocuments(_filter, function (err, doc) {
        if (err) {
            res.json({errmsg: err});
        } else {
            count = doc
        }
    })

    Players.find(_filter).limit(10)
        .sort({'_id': -1})
        .exec(function (err, players) {
            if (err||players.length==0) {
                res.status(404);
                res.json({message:"Players Not Found!(Invalid keyword)",errmsg: err});
            } else {
                res.send(JSON.stringify(players,null,5));
            }

        });
};

//fuzzy search
router.findOneByPosition= (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var keyword = req.params.position;

    var _filter={
        $or: [

            {position: {$regex: keyword, $options: '$i'}},

        ]
    }
    var count = 0
    Players.countDocuments(_filter, function (err, doc) {
        if (err) {
            res.json({errmsg: err});
        } else {
            count = doc
        }
    })

    Players.find(_filter).limit(10)
        .sort({'_id': -1})
        .exec(function (err, players) {
            if (err||players.length==0) {
                res.status(404);
                res.json({message:"Players Not Found!(invalid keyword)",errmsg: err});
            } else {
                res.send(JSON.stringify(players,null,5));
            }

        });
};

//add a player
router.addPlayer = (req, res) => {


    res.setHeader('Content-Type', 'application/json');

    var player = new Players();

    player.name =  req.body.name;
    player.age=req.body.age;
    player.height=req.body.height;
    player.weight=req.body.weight;
    player.nationality=req.body.nationality;
    player.position=req.body.position;
    player.teamId=req.body.teamId;
    player.salary=req.body.salary;
    player.joinTime=req.body.joinTime;

    if(player.age>0&& player.height>0&& player.weight>0&&player.salary>0){
        player.save(function(err,player) {
            if (err)
                res.json({ message: 'Player NOT Added!', errmsg : err } );// return a suitable error message
            else
                res.json({ message: 'Player Added Successfully!',data:player});// return a suitable success message
        });
    }
    else  {
        res.status(404);
        res.json({message: 'Player NOT Added!(invalid value!)'});// return a suitable error message
    }

};

//change salary
router.changeSalary = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Players.findByIdAndUpdate({"_id": req.params.id}, {$set: {salary: req.body.salary}}, function (err) {
        if (err)
            res.json({message: 'Player NOT Change salary!', errmsg: err});
        else
            res.json({message: 'Player Successfully Change salary!'});
    });
};

//change teamId
router.changeTeamId = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Players.findByIdAndUpdate({"_id": req.params.id}, {$set:{teamId: req.body.teamId}}, function (err) {
        if (err)
            res.json({message: 'Player NOT Change teamId!', errmsg: err});
        else
            res.json({message: 'Player Successfully Change teamId!'});
    });

};

//delete a player
router.deletePlayer= (req, res) => {

    Players.findByIdAndRemove(req.params.id, function (err,player) {
        if (err||player==null) {
            res.status(404)
            res.json({message: 'Player NOT DELETED!(invalid id)', errmsg: err});
        }
        else

            res.json({message: 'Player Successfully Deleted!',data:player});

    });
};
module.exports = router;