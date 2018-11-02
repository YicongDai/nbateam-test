process.env.NODE_ENV = 'test';
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
chai.use(require('chai-things'))
chai.use(chaiHttp);
let _ = require('lodash' );
let Team = require("../../models/teams");
let Player = require("../../models/players");
let mongoose = require('mongoose');

describe('Teams', function () {
    beforeEach(function(done){
        var newTeam = new Team({
            _id : mongoose.Types.ObjectId("5bc78656f34c1e2078895de5"),
            zone : { name : "Pacific Division", location : "West" },
            name : "Los Angeles Cippers",
            city: "Los Angeles",
            numPlayer : 20,
            championships : 20,
            rank : 10,
            playerId : [ mongoose.Types.ObjectId("5bcb5e110d3f4a3298c92564")]
        });
        newTeam.save(function(err) {
            done();
        });
    });
    beforeEach(function(done){
        var newTeam1 = new Team({
            _id : mongoose.Types.ObjectId("5bc786def34c1e2078895de7"),
            zone : { name : "Pacific Division", location : "West" },
            name : "Los Angeles Lakers",
            city: "Los Angeles",
            numPlayer : 16,
            championships : 16,
            rank : 11,
            playerId : [ mongoose.Types.ObjectId("5bcb60fa0d3f4a3298c92565")]
        });
        newTeam1.save(function(err) {
            done();
        });
    });
    beforeEach(function(done){
        var newPlayer = new Player({
            _id : mongoose.Types.ObjectId("5bcb5e110d3f4a3298c92564"),
            name : "Avery Bradley",
            age:27
        });
        newPlayer.save(function(err) {
            done();
        });
    });
    beforeEach(function(done){
        var newPlayer1 = new Player({
            _id : mongoose.Types.ObjectId("5bcb60fa0d3f4a3298c92565"),
            name : "LeBorn James",
            age:33
        });
        newPlayer1.save(function(err) {
            done();
        });
    });

    describe('GET api', function () {
        describe('GET /teams', () => {
            it('should return all the teams in an array', function (done) {
                chai.request(server)
                    .get('/teams')
                    .end((err, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(2);
                        let result = _.map(res.body, (teams) => {
                            return {name: teams.name, city: teams.city}
                        });
                        expect(result).to.include({name: "Los Angeles Cippers", city: "Los Angeles"});
                        expect(result).to.include({name: "Los Angeles Lakers", city: "Los Angeles"});
                        Team.collection.drop();
                        Player.collection.drop();
                        done();
                    });
            });
        });
    });
    describe('GET /teams/:id', function () {
        describe('When id is valid', function () {
            it('should return the specific team', function (done) {
                chai.request(server)
                    .get('/teams')
                    .end(function (err, res) {
                        chai.request(server)
                            .get('/teams/' + res.body[0]._id)
                            .end(function (err, res) {
                                expect(res).to.have.status(200);
                                expect(res.body).to.be.a('Object');
                                expect(res.body).include({name: "Los Angeles Cippers", city: "Los Angeles"});
                                Team.collection.drop();
                                Player.collection.drop();
                                done();
                            });
                    });
            });
        });
        describe('When id is invalid', function () {
            it('should return  a 404 and a message for invalid team id', function (done) {
                chai.request(server)
                    .get('/teams/' + "aabbcc")
                    .end(function (err, res) {
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.property('message', 'Team NOT Found! Please check the right id');
                        Team.collection.drop();
                        Player.collection.drop();
                        done();
                    });
            });
         });
    });
    describe('GET /names/:name', () => {
        describe('When keyword is valid', function () {
            it('should return the specific team with fuzzy search', function (done) {
                chai.request(server)
                    .get('/teams/name' + "/Los")
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.equal(2);
                        let result = _.map(res.body, (teams) => {
                            return {name: teams.name}
                        });
                        expect(result).to.include({name: "Los Angeles Cippers"});
                        expect(result).to.include({name: "Los Angeles Lakers"});
                        Team.collection.drop();
                        Player.collection.drop();
                        done();
                    });
            });
        });
        describe('When keyword is invalid', function () {
            it('should return  a 404 and a message for invalid keyword', function (done) {
                chai.request(server)
                    .get('/teams/name' + "/aabbcc")
                    .end(function (err, res) {
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.property('message', 'Teams Not Found!(invalid keyword)');
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
                .get('/teams')
                .end(function (err, res) {
                    chai.request(server)
                        .get('/teams/' + res.body[0]._id + "/info")
                        .end(function (err, res) {
                            expect(res).to.have.status(200);
                            expect(res.body).to.be.a('object');
                            expect(res.body).to.have.property("message", 'Team Successfully find player!');
                            expect(res.body).to.have.property("data");
                            expect(res.body.data).to.have.property("playerId");
                            expect(res.body.data.playerId).be.a('array');
                            expect(res.body.data.playerId).include({name: "Avery Bradley",age:27});
                            Team.collection.drop();
                            Player.collection.drop();
                            done();
                        });
                });
        });
    });

    describe('POST api', function () {
        describe('POST /teams', function () {
            it('should return confirmation message', function (done) {
                let team = {
                    zone: {name: "Center Division", location: "East"},
                    name: "Cleveland Cavaliers",
                    city: "Cleveland",
                    numPlayer: 20,
                    championships: 16,
                    rank: 1,
                };
                chai.request(server)
                    .post('/teams')
                    .send(team)
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.have.property('message').equal('Team Added Successfully!');

                        done();
                    });
            });
            after(function (done) {
                chai.request(server)
                    .get('/teams')
                    .end(function (err, res) {
                        let result = _.map(res.body, (team) => {
                            return {
                                name: team.name,
                                city: team.city
                            };
                        });
                        expect(result).to.include({name: 'Cleveland Cavaliers', city: "Cleveland"});

                        Team.collection.drop();
                        Player.collection.drop();
                        done();


                    });
            });  // end-after
        }); // end-describe
    });

    describe('PUT api',function() {
        describe('PUT /teams/:id/rank', () => {
            describe('When id is valid', function () {
                it('should return a message and the rank changed', function (done) {
                    chai.request(server)
                        .get('/teams')
                        .end(function (err, res) {
                            let rank = {rank: 111};
                            chai.request(server)
                                .put('/teams/' + res.body[0]._id + '/rank')
                                .send(rank)
                                .end(function (error, response) {
                                    expect(response).to.have.status(200);
                                    expect(response.body).to.be.a('object');
                                    expect(response.body).to.have.property('message').equal('Team Successfully ChangeRank!');
                                    done()
                                });
                        });
                });
                after(function (done) {
                    chai.request(server)
                        .get('/teams')
                        .end(function (err, res) {

                            expect(res.body[0].rank).equal(111);
                            Team.collection.drop();
                            Player.collection.drop();
                            done();
                        });
                });  // end-after
            }); // end-describe
        });
    });
});

