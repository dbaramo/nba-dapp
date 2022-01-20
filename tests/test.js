const teamNameData = require("../data/team-name-data");

test('30 teams should be present', () => {
  expect(Object.keys(teamNameData).length).toBe(30);
});