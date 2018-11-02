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

});