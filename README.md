# Decentralized cup
A cup in which, for the duration of it, any player can upload any kind of levels to it with as minimum limitations as possible.

The cup is inspired in decentralized systems in which something is accomplished without a central authority and with as little censorship as possible. In this case, anyone should be able to upload levels to the cup with as little censorship or limitations as possible, although because of technical limitations we certainly would need a central authority to do some minimum validations and managing of the online cup (e.g. manually checking that levels are freshly new).

## Potential rules set example

1. Start of the cup.
    1. The cup is started with a set deadline, date and time.
    2. Initially there are no events.
2. Any player can submit levels at any moment, to be added as events to the cup.
    1. Submitted levels are first validated. Basic valid criteria:
        1. Levels must be new and valid to EOL.
        2. The level must be finishable, but cannot be finishable in 0 seconds.
    2. Once a level is validated it is added as a new ongoing event.
        1. Events can be added at any moment and all have the same deadline as the cup.
        2. Level designers can (and probably should) play their own levels.
        3. The name follows the usual sequential pattern e.g. "Des1Cxxx.lev" or "D1Cupxxx.lev".
        4. At EOL, times and players are hidden.
3. Only the 5 top ranked levels will count in the results.
    1. Since levels can be added at any moment there could be too many levels to play, so only a small selection will count for the final results.
    2. This selection is done by ranking the levels, once the cup finished, only the top 5 ranked levels will be taken into account.
    3. The levels ranking will ideally be updated every time a new level is added to the cup and every time a kuksi makes a new PR.
    4. The ranking will be always visible to everyone, so players can decide in which levels to invest their time.
    6. The ranking for each level is calculated as:
        1. `Rank = Total unique PRs - sum of PRs above the total average ` 
        2. Total unique PRs refers to the sum of all PRs without counting shadow PRs.
        3. Above average PRs are calculated as the total sum of PRs that are above the average of the total unique PRs.
        4. This ranking is set to avoid favoring trivial or too short levels over complex and posibly more creative levels. Shadow PRs are a sign of trivial levels, like for example in "Tutor1.lev". Removing times above average from the equation helps filtering possible "spam" PRs, for example an 1 hour PR in a 10 seconds level.
    7. Levels are ranked in a descending order by their rank number, this rank number is not shared, only their position on the ranking.
4. End of the cup.
    1. All events finish along the cup deadline and only times finished online are taken into account. 
    2. The levels ranking freezes, and the final top 5 levels are revealed.
    3. For this top 5 levels, the player points are calculated as in normal cups, without any skips.

# Potential issues and solutions

## Too many levels to play

If there are 100 levels uploaded, no one will be able to hoyla every level.

Possible solutions:
#### Only top X most finished levels count in the result.
Rank levels in a descending order by counting the number of kuskis that finished it. This rank should be updated regularly and it should be visible to everyone. Once the cup ends, the ranking freezes and the results are calculated for the top X levels.

A problem with this approach is that it will favor trivial, easy and short levels over complex levels that are harder or longer to finish. This doesn't seem to be straightforward to avoid without manually censoring unwanted types of levels.  

To fix this we could require a minimum number of PRs for the level to start ranking in the list. For example, new levels must obtain 10 finishes by different kuskis to be added to the ranking.

#### Only top X levels count in the result, using PRs ranking.
Rank levels in a descending order, with the following calculation per level:
- Sum all unique PRs on the level, meaning that shadow PRs count only once. This is to avoid favoring trivial levels where usually many players have the same PRs (e.g. Tutor1.lev).
- Calculate the average PR and remove all PRs that are over this average. This is to avoid favoring long spam PRs (e.g. someone has a PR of 60 minutes in a 3 seconds level).
- Calculate the level total rank by summing all the remaining PRs.

Example: 

<table><thead><tr><th>Level</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>Total</th><th>Average</th><th>Rank</th><th>Top</th></tr></thead><tbody><tr><td>Lvl 1</td><td>3:50</td><td>3:60</td><td>3:90</td><td>3:90</td><td>3:90</td><td>60:59:59</td><td>61:10:59</td><td>15:17:64</td><td>11:00</td><td>3</td></tr><tr><td>Lvl 2</td><td>10:00</td><td>10:50</td><td>11:00</td><td></td><td></td><td></td><td>31:50</td><td>10:50</td><td>20:50</td><td>2</td></tr><tr><td>Lvl 
3</td><td>21:00</td><td></td><td></td><td></td><td></td><td></td><td>21:00</td><td>21:00</td><td>21:00</td><td>1</td></tr></tbody></table>

In this example, the `Lvl 3` is the top ranked level even though it only has 1 finish (1 PR). The `Lvl 1` is last in 3rd position, even though it is the level with most PRs including the longest PR by far. This is because the shadow PRs are not counted in the calculations, plus the long spam PR is finally ignored since it's above the average.

This approach favors longer levels over short ones. The problem is that ff someone were to submit a really long level (like a 60 min level) right before the cup ends, and be the only one to finish it, that kuski will secure a 1st position without competitors in that event.

#### PRs ranking, fix for favoring longest levels.

Rank levels in a descending order, with the following calculation per level:
- Sum all unique PRs on the level but substract all PRs that are above 2 times the best time. For example, if the best time is 10 seconds, times above 20 seconds are ignored in the calculation.
- Rank by descending order and take only the top X levels for the result.

Example:

<table><thead><tr><th>Level</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>Total</th><th>Rank</th><th>Top</th></tr></thead><tbody><tr><td>Lvl 1</td><td>3:50</td><td>3:60</td><td>3:90</td><td>3:90</td><td>3:90</td><td>60:59:59</td><td>61:10:59</td><td>11:00</td><td>3</td></tr><tr><td>Lvl 2</td><td>10:00</td><td>10:50</td><td>11:00</td><td></td><td></td><td></td><td>31:50</td><td>31:50</td><td>1</td></tr><tr><td>Lvl 3</td><td>21:00</td><td></td><td></td><td></td><td></td><td></td><td>21:00</td><td>21:00</td><td>2</td></tr></tbody></table>

Here the trivial short level gets the lowest rank again. But the longest level is not in the first position anymore like in the previous example. Only 1 finish was not enough to win over a half long level with more finishes.

## Spam levels

Someone can spam 100 levels in one day. 

Possible solutions:
#### Limit the amount of levels a player can upload to the cup.
#### Limit the number of levels a player can upload per week.
#### Upload fee.
Players start with 50 points, uploading a level to the cup costs 25 points.
If your level ends up in the top X, you get 50 points for it (double the investment). 
A rule like this could incentivise players to submit levels, but also to think twice before submitting.

## Levels manual validation

How to quickly validate that levels are not old levels, or that submitter is actually the designer of the level? Should there be a penalty if that's confirmed? Should the event be cancelled, removed, filtered out of the ranking?

## Technical or necessary limitations

Currently the cup would need some considerate manual orchestration. This management will be centralized as opposed to the cup levels on which anyone can collaborate with. This centralized person or group of persons will be the cup admins.

The cup must be managed by the admins in elma.online and/or somewhere else. The duration must be set from the beginning.

The levels ranking should be visible to everyone all the time and updated regularly by the admins.

As in a normal cup:
- Only freshly new levels are accepted, this must be validated manually.
- Accepted levels must be manually renamed in sequential order by an admin and uploaded to the cup.
- Levels must be hidden at EOL.
- Only PRs finished online are counted into the result.
- Optionally the cup could require uploading PR replays. This could be annoying to the players depending on how things play out.
