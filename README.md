# Decentralized cup
A cup in which, for the duration of it, any player can upload any kind of levels to it with as minimum limitations as possible.

The cup is inspired in decentralized systems in which something is accomplished without a central authority and with as little censorship as possible. In this case, anyone should be able to upload levels to the cup with as little censorship or limitations as possible, although because of technical limitations we certainly would need a central authority to do some minimum validations and managing of the online cup (e.g. manually checking that levels are freshly new).

# Potential issues

## Too many levels to play

If there are 100 levels uploaded, no one will be able to hoyla every level.

Possible solutions:
#### Only top X most finished levels count in the result.
Rank levels in a descending order by counting the number of kuskis that finished it. This rank should be updated regularly and it should be visible to everyone. Once the cup ends, the ranking freezes and the results are calculated for the top X levels.

A problem with this approach is that it will favor trivial, easy and short levels over complex levels that are harder or longer to finish. This doesn't seem to be straightforward to avoid without manually censoring unwanted types of levels.  

#### Only top X levels count in the result, using PRs ranking.
Rank levels in a descending order, with the following calculation per level:
- Sum all unique PRs on the level, meaning that shadow PRs count only once. This is to avoid favoring trivial levels where usually many players have shadow PRs (e.g. Tutor1.lev).
- Calculate the average PR.
- Remove all PRs that are over this average. This is to avoid favoring long spam PRs (e.g. someone has a PR of 60 minutes in a 3 seconds level).

Example: 

<table><thead><tr><th>Level</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>Total</th><th>Average</th><th>Rank</th><th>Top</th></tr></thead><tbody><tr><td>Lvl 1</td><td>3:50</td><td>3:60</td><td>3:90</td><td>3:90</td><td>3:90</td><td>60:59:59</td><td>61:10:59</td><td>15:17:64</td><td>11:00</td><td>3</td></tr><tr><td>Lvl 2</td><td>10:00</td><td>10:50</td><td>11:00</td><td></td><td></td><td></td><td>31:50</td><td>10:50</td><td>20:50</td><td>2</td></tr><tr><td>Lvl 
3</td><td>21:00</td><td></td><td></td><td></td><td></td><td></td><td>21:00</td><td>21:00</td><td>21:00</td><td>1</td></tr></tbody></table>

In this example, the `Lvl 3` is the top ranked level even though it only has 1 finish (1 PR). The `Lvl 1` is last in 3rd position, even though it is the level with most PRs including the longest PR by far. This is because the shadow PRs are not counted in the calculations, plus the long spam PR is finally ignored since it's above the average.

## Spam

Someone can spam 100 levels in one day. 

Possible solutions:
#### Limit the amount of levels a player can upload to the cup.
#### Limit the number of levels a player can upload per week.
#### Upload fee.
Players start with 50 points, uploading a level to the cup costs 25 points.
If your level ends up in the top X, you get 50 points for it (double the investment).

## Technical limitations

Currently the cup would need some considerate manual orchestration. This management will be centralized as opposed to the cup levels on which anyone can collaborate with. This centralized person or group or persons will be the cup admins.

The cup must be managed by the admins in elma.online or somewhere else. The duration must be set from the beginning.

The levels ranking should be visible to everyone all the time and updated regularly by the admins.

As in a normal cup:
- Only freshly new levels are accepted, this must be validated manually.
- Accepted levels must be manually renamed in sequential order by an admin and uploaded to the cup.
- Levels must be hidden at EOL.
- Only PRs finished online are counted into the result.
- May or may not require uploading PR replays.


