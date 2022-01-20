# nba-dapp
Application that allows you to create over/under wagers on NBA games that can be sent to anyone you want. Wagers are settled and created via smart contract using Ethereum.

![nba-dapp gif](https://media.giphy.com/media/RpFK8hHLvIF42wKZpq/giphy.gif)

<strong>/client</strong>
<br />
User-interface of application that allows you to create a wager with some ethereum on the over/under of the NBA games to be played that day.

Built using: React/Redux, [antd design library](https://ant.design/) 


<strong>/contracts</strong>
<br />
Smart contract that handles the payout to the winner of the over/under bet. 

<strong>/data/team-spread-data.js</strong>
<br />
Scraper that gets the current odds for NBA games pulled from https://www.foxsports.com/nba/odds

<strong>/models</strong>
<br />
Schemas for wagers using mongoose/mongodb

<strong>/routes</strong>
<br />
API routes for different crud actions for the app
