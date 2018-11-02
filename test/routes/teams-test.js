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
});