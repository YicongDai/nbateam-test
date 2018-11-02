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
        describe('GET /names/:name', () => {
            describe('When keyword is valid', function () {
                it('should return the specific player with fuzzy search', function (done) {
                    chai.request(server)
                        .get('/players')
                        .end(function (err, res) {
                            chai.request(server)
                                .get('/players/name' + "/s")
                                .end(function (err, res) {
                                    expect(res).to.have.status(200);
                                    expect(res.body).to.be.a('array');
                                    expect(res.body.length).to.equal(2);
                                    let result = _.map(res.body, (teams) => {
                                        return {name: teams.name}
                                    });
                                    expect(result).include({name: "LeBorn James"});
                                    expect(result).include({name: "Stephen Curry"});
                                    Team.collection.drop();
                                    Player.collection.drop();
                                    done();
                                });
                        });
                });

            });
            describe('When keyword is invalid', function () {
                it('should return  a 404 and a message for invalid keyword', function (done) {
                    chai.request(server)
                        .get('/players/name' + "/aabbcc")
                        .end(function (err, res) {
                            expect(res).to.have.status(404);
                            expect(res.body).to.have.property('message', 'Players Not Found!(Invalid keyword)');
                            Team.collection.drop();
                            Player.collection.drop();
                            done();
                        });
                });
            });
        });
        describe('GET /position/:position', () => {
            describe('When keyword is valid', function () {
                it('should return the specific player with fuzzy search', function (done) {
                    chai.request(server)
                        .get('/players')
                        .end(function (err, res) {
                            chai.request(server)
                                .get('/players/position' + "/sf")
                                .end(function (err, res) {
                                    expect(res).to.have.status(200);
                                    expect(res.body).to.be.a('array');
                                    expect(res.body.length).to.equal(2);
                                    let result = _.map(res.body, (teams) => {
                                        return {name: teams.name}
                                    });
                                    expect(result).include({name: "LeBorn James"});
                                    expect(result).include({name: "Kevin Durant"});
                                    Team.collection.drop();
                                    Player.collection.drop();
                                    done();
                                });
                        });
                });
            });
            describe('When keyword is invalid', function () {
                it('should return  a 404 and a message for invalid keyword', function (done) {
                    chai.request(server)
                        .get('/players/name' + "/aabbcc")
                        .end(function (err, res) {
                            expect(res).to.have.status(404);
                            expect(res.body).to.have.property('message', 'Players Not Found!(Invalid keyword)');
                            Team.collection.drop();
                            Player.collection.drop();
                            done();
                        });
                });
            });
        });

        describe('GET /:id/info', () => {
            it('should return the specific player related to player schema', function (done) {
                chai.request(server)
                    .get('/players')
                    .end(function (err, res) {
                        chai.request(server)
                            .get('/players/' + res.body[0]._id + "/info")
                            .end(function (err, res) {
                                expect(res).to.have.status(200);
                                expect(res.body).to.be.a('object');
                                expect(res.body).to.have.property("message").equal('Player Successfully find team!');

                                expect(res.body).to.have.property("data");

                                expect(res.body.data).to.have.property("teamId");
                                expect(res.body.data.teamId).be.a('Object');

                                expect(res.body.data.teamId).include({name: "Golden State Warriors"});
                                Team.collection.drop();
                                Player.collection.drop();
                                done();

                            });
                    });
            });
        });
    });
    describe('POST api', function () {
        describe('POST /players', function () {
            it('should return confirmation message', function (done) {
                let player = {
                    name: "Klay Thompson",
                    age: 28,
                    height: 201,
                    weight: 98,
                    nationality: "USA",
                    position: "PG/SG",
                    teamId: "5bd0e6547a18b008fca9f57d",
                    salary: 1899,
                    joinTime: "2011"

                };
                chai.request(server)
                    .post('/players')
                    .send(player)
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message').equal('Player Added Successfully!');
                        done();
                    });
            });
            after(function (done) {
                chai.request(server)
                    .get('/players')
                    .end(function (err, res) {
                        let result = _.map(res.body, (player) => {
                            return {
                                name: player.name,
                            };
                        });
                        expect(result).to.include({name: 'Klay Thompson'});

                        Team.collection.drop();
                        Player.collection.drop();

                        done();
                    });
            });  // end-after
        }); // end-describe

    });
});