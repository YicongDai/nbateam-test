# Assignment 1 - API testing and Source Control.

Name: Yicong Dai

## Overview.
This project can help users to view the basic information of NBA teams and players,which related with each other, and realize the functions to add, delete, update and query operations and sophisticated API target for these models.In addition it has deployed to github. And it finally uses mocha, chai and git to write test cases(included boundary tests) and do API testing for these functions in the local database.


## API endpoints.
teams：
 + GET /teams - Get all teams.
 + GET /teams/:id - Get a specific team by id
 + GET /teams/name/:name - Get teams which meet the conditions by fuzzy search for name.
 + GET /teams/:id/info - Get player information related to a specific team.
 + POST /teams - Add a new team.
 + PUT /teams/:id/rank - Update the rank of a specific team.
 + PUT /teams/:id/numPlayer - Update the numPlayer of a specific team.
 + DELETE /teams/:id - Delete a specific team by id

players：
 + GET /players - Get all players.
 + GET /players/:name - Get a specific player by name
 + GET /players/name/:name - Get players which meet the conditions by fuzzy search for name.
 + GET /players/position/:position - Get players which meet the conditions by fuzzy search for position.
 + GET /players/:id/info - Get team information related to a specific player.
 + POST /players - Add a new players.
 + PUT /players/:id/salary - Update the salary of a specific players.
 + DELETE /players /:id - Delete a specific players by id

## Data storage.
This test will include the integration of MongoDB  with the API.So the database schemas are as follows:
teams：

    let TeamSchema = new mongoose.Schema({
            name: String,
            city: String,
            zone:{name:String,location:String},
            numPlayer: Number,
            championships:Number,
            rank:Number,
            playerId: [{type: mongoose.Schema.Types.ObjectId, ref: 'players'}],
        },{ versionKey:false},

        { collection: 'teams' });

players：

    let PlayerSchema = new mongoose.Schema({
        name: String,
        age: Number,
        height: Number,
        weight: Number,
        nationality: String,
        position: String,
        teamId: {type: mongoose.Schema.Types.ObjectId, ref: 'teams'},
        salary: Number,
        joinTime: String

        },
        { versionKey:false},
        { collection: 'players' });

## Sample Test execution.
 Tests for teams:
 
        C:\Users\Administrator\Desktop\NBA\NBATeam-test>npm test

        > nbateam-test@0.0.0 test C:\Users\Administrator\Desktop\NBA\NBATeam-test
        > set NODE_ENV=test && mocha test/routes/teams-test.js



          Teams
            GET api
              GET /teams
        Connected to Database: mongodb://localhost/node-test
                √ should return all the teams in an array (53ms)
              GET /teams/:id
                When id is valid
                  √ should return the specific team
                When id is invalid
                  √ should return  a 404 and a message for invalid team id
              GET /names/:name
                When keyword is valid
                  √ should return the specific team with fuzzy search
                When keyword is invalid
                  √ should return  a 404 and a message for invalid keyword
              GET /:id/info
                √ should return the specific player related to player schema
            POST api
              POST /teams
                when values are valid
                  √ should return confirmation message
                when values are invalid
                  √ should return confirmation message
            PUT api
              PUT /teams/:id/rank
                When id is valid
                  √ should return a message and the rank changed
                When id is invalid
                  √ should return a 404 and a message for invalid team id
              PUT /teams/:id/numPlayer
                When id is valid
                  √ should return a message and the nunmPlayer changed (54ms)
                When id is invalid
                  √ should return a 404 and a message for invalid team id
            DELETE api
              delete /teams/:id
                When id is valid
                  √ should return a message and delete a specific team
                When id is invalid
                  √ should return a 404 and a message for invalid team id


          14 passing (10s)

 Tests for players:
 
       C:\Users\Administrator\Desktop\NBA\NBATeam-test>npm test

       > nbateam-test@0.0.0 test C:\Users\Administrator\Desktop\NBA\NBATeam-test
       > set NODE_ENV=test && mocha test/routes/players-test.js



         Players
           GET api
             GET /players
       Connected to Database: mongodb://localhost/node-test
               √ should return all the players in an array (40ms)
             GET /names/:name
               When keyword is valid
                 √ should return the specific player with fuzzy search
               When keyword is invalid
                 √ should return  a 404 and a message for invalid keyword
             GET /position/:position
               When keyword is valid
                 √ should return the specific player with fuzzy search
               When keyword is invalid
                 √ should return  a 404 and a message for invalid keyword
             GET /:id/info
               √ should return the specific player related to player schema
           POST api
             POST /players
               when values are valid
                 √ should return confirmation message (47ms)
               when values are valid
                 √ should return confirmation message
           PUT api
             PUT /players/:id/salary
               When id is valid
                 √ should return a message and the salary changed (50ms)
           DELETE api
             delete /players/:id
               When id is valid
                 √ should delete a specific player
               When id is invalid
                 √ should return a 404 and a message for invalid player id


         11 passing (10s)

## Extra features.
Although this project integrated with local mongoDB when tested, it will create a new database named node-testing for API test in order to prevent new data from polluting the original database. And before each test case, it will add some new data for teams and players; then, after each test, the database is cleared before the next test case is ran.In addition,it used some testing principles:(1) The silent principle; (2) Make expectations about the target state (if relevant) as well as the target result/return value; (3) Normal, Boundary (if relevant) and Error (if relevant) cases; (4) Test case isolation and some nested describe blocks.
