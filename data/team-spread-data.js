const osmosis = require('osmosis');
const moment = require('moment');
const teamNameData = require("./team-name-data");
var AsyncPolling = require('async-polling');

var feed = [];
var internalFeed = [];

function fetchSpread(){

  const dateForSpread = moment().format("YYYY-MM-DD");
  const spreadSite = `https://www.foxsports.com/nba/odds?date=${dateForSpread}`;
  
  const spreadData = new osmosis.get(spreadSite);
  const teamRow = ".wisbb_standardTable.wisbb_oddsTable.wisbb_altRowColors";
  const gameRow = ".wisbb_gameWrapper";

  spreadData.run()
  spreadData
  .find(gameRow)
  .set({
    awayCity: ".wisbb_teamCity:first",
    awayTeamName: ".wisbb_teamName:first",
    homeCity: ".wisbb_at + span .wisbb_teamCity",
    homeTeamName: ".wisbb_at + span .wisbb_teamName",
    overUnder: ".wisbb_overUnderCol:first",
    spread: ".wisbb_runLinePtsCol"
  })
  .then(function(context, data, next, done) {
    var index;
    var newSpread = data["spread"].split("");
    for(let i = 1; i < newSpread.length; i++){
      if(newSpread[i] === "+" || newSpread[i] === "-"){
        index = i;
      }
    }
  
    var vTeam = newSpread.slice(0, index).join("");
    var hTeam = newSpread.slice(index).join("");
    var awayTeamName = `${data.awayCity} ${data.awayTeamName}`;
    var homeTeamName = `${data.homeCity} ${data.homeTeamName}`;
  
    newData = Math.floor(data["overUnder"].replace(" O/U", ""));
    feed.push({
      awayTeam: awayTeamName,
      aTriCode: teamNameData[awayTeamName],
      homeTeam: homeTeamName,
      hTriCode: teamNameData[homeTeamName],
      overUnder: newData,
      currentSpread: {
        vTeam: parseInt(vTeam),
        hTeam: parseInt(hTeam)
      }
    });
  })
}

// ********* Polls ever 5 Min
AsyncPolling(function (end) { 
  fetchSpread()
  end();
  feed.length = 0;
}, 300000).run();

module.exports = feed;



// module.exports = feed = [{ 
//   awayTeam: "Boston Celtics",
//   aTriCode: teamNameData["Boston Celtics"],
//   homeTeam: "Portland Trail Blazers",
//   hTriCode: teamNameData["Portland Trail Blazers"],
//   overUnder: 220,
//   currentSpread: {
//     vTeam: +3,
//     hTeam: -3
//   }
// }];

