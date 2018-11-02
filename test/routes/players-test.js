process.env.NODE_ENV = 'test';
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
chai.use(require('chai-things'));
chai.use(chaiHttp);
let _ = require('lodash' );
let Team = require("../../models/teams");
let Player = require("../../models/players");
let mongoose = require('mongoose');

describe('Players', function () {
    beforeEach(function (done) {
        var newPlayer = new Player({
            _id: mongoose.Types.ObjectId("5bcb5ca70d3f4a3298c92562"),
            name: "Stephen Curry",
            age: 30,
            height: 191,
            weight: 86,
            nationality: "USA",
            position: "PG/SG",
            teamId: mongoose.Types.ObjectId("5bc786a3f34c1e2078895de6"),
            salary: 3746,
            joinTime: "2009"
        });
        newPlayer.save(function (err) {
            done();
        });
    });
    beforeEach(function (done) {
        var newPlayer = new Player({
            _id: mongoose.Types.ObjectId("5bcb5ca70d3f4a3298c92562"),
            name: "Stephen Curry",
            age: 30,
            height: 191,
            weight: 86,
            nationality: "USA",
            position: "PG/SG",
            teamId: mongoose.Types.ObjectId("5bc786a3f34c1e2078895de6"),
            salary: 3746,
            joinTime: "2009"
        });
        newPlayer.save(function (err) {
            done();
        });
    });
    beforeEach(function (done) {
        var newPlayer1 = new Player({
            _id: mongoose.Types.ObjectId("5bcb5d470d3f4a3298c92563"),
            name: "Kevin Durant",
            age: 30,
            height: 206,
            weight: 109,
            nationality: "USA",
            position: "SF",
            teamId: mongoose.Types.ObjectId("5bc786a3f34c1e2078895de6"),
            salary: 3000,
            joinTime: "2018"
        });
        newPlayer1.save(function (err) {
            done();
        });
    });
    beforeEach(function (done) {
        var newPlayer2 = new Player({
            _id: mongoose.Types.ObjectId("5bcb60fa0d3f4a3298c92565"),
            name: "LeBorn James",
            age: 33,
            height: 203,
            weight: 115,
            nationality: "USA",
            position: "SF",
            teamId: mongoose.Types.ObjectId("5bc78656f34c1e2078895de7"),
            salary: 3565,
            joinTime: "2018"

        });
        newPlayer2.save(function (err) {
            done();
        });
    });
    beforeEach(function (done) {
        var newTeam = new Team({
            _id: mongoose.Types.ObjectId("5bc786a3f34c1e2078895de6"),
            name: "Golden State Warriors",
            city: "Oakland",
        });
        newTeam.save(function (err) {
            done();
        });
    });
    beforeEach(function (done) {
        var newTeam1 = new Team({
            _id: mongoose.Types.ObjectId("5bc786def34c1e2078895de7"),
            zone: {name: "Pacific Division", location: "West"},
            name: "Los Angeles Lakers",
        });
        newTeam1.save(function (err) {
            done();
        });
    });
    describe('GET api', function () {
        describe('GET /players', () => {
            it('should return all the players in an array', function (done) {
                chai.request(server)
                    .get('/players')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(3);
                        let results = _.map(res.body, (players) => {
                            return {name: players.name}
                        });
                        expect(results).to.include({name: "Stephen Curry"});
                        expect(results).to.include({name: "Kevin Durant"});
                        expect(results).to.include({name: "LeBorn James"});
                        Team.collection.drop();
                        Player.collection.drop();
                        done();
                    });
            });

        });
    });
});