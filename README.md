# Decentralized cup
A cup in which, for the duration of it, any player can upload any kind of levels to it with as minimum limitations as possible. All events are played simultaneously and they all end at the same time with the cup's deadline. At the end, only the most popular levels will count into the results to crown the winner.

The cup is inspired in decentralized systems in which something is accomplished without a central authority and with as little censorship as possible. In this case, anyone should be able to upload levels to the cup with as little censorship or limitations as possible, although because of technical limitations we certainly would need a central authority to do some minimum validations and managing of the online cup (e.g. manually checking that levels are freshly new).

## Potential Cup rules and information

1. Start of the cup.
    1. The cup is started with a set deadline (date and time).
    2. Initially there are no events to play.
2. Any player can submit levels at any moment, to be added as events to the cup.
    1. Submitted levels are first validated. Basic valid criteria:
        1. Levels must be new and valid to EOL.
        2. The level must be finishable, but cannot be finishable in 0 seconds.
        3. And levels cannot be a remixed version of another level in the cup.
    2. Once a level is validated it is added as a new ongoing event.
        1. Events can be added at any moment and all have the same deadline as the cup.
        2. Level designers can (and probably should) play their own levels.
        3. The name follows the usual sequential pattern e.g. "Des1Cxxx.lev" or "D1Cupxxx.lev".
        4. At EOL, times and players are hidden.
3. Only the X top ranked levels will count in the results.
    1. Since levels can be added at any moment there could be too many levels to play, so only a small selection will count for the final results.
    2. This selection is done by first ranking the levels, and once the cup finishes, only the top ranked levels will be taken into account.
    4. This ranking will be always visible to everyone, so players can decide in which levels to invest their time.
    5. The ranking points for each level is calculated as:
        1. The sum of all finished times, except the times that are above 2x times the best time in the level.
        2. Removing times above 2x the best time from the equation helps filtering possible "spam" or too slow times, for example an 1 hour finish time in a 10 seconds level.
    6. Levels are ranked in a descending order by their ranking points. This points are not shared, only their position on the ranking.
    7. The levels ranking will ideally be updated every time a new level is added to the cup and every time a player finishes a level.
4. End of the cup.
    1. All events finish along the cup deadline and only times finished online are taken into account. 
    2. The levels ranking freezes, and the final top levels are revealed.
    3. For this top levels, the player points are calculated as in normal cups, without any skips.


In this example of potential rules there are a few variables to define: 
- Duration of the cup (e.g. 1 month).
- How many levels are counted in the results (e.g. only Top 5 most popular levels get into the results).
- Limit of levels that can be uploaded per player/day/week. (e.g. players can upload up to 5 levels per week, up to 1 per day). Note that people could upload levels without really having to play the cup.

If 10 players contributed with levels for a 1 month cup with 5 levels per week tops each, the cup would have an aprox. maximum of 10 players * 4 weeks * 5 levels = 200 levels.

# Potential issues and solutions

## Too many levels to play

If there are 100 levels uploaded, no one will be able to hoyla every level.

Possible solutions:
#### 1. Only top X most finished levels count in the result.
Rank levels in a descending order by counting the number of kuskis that finished it. This rank should be updated regularly and it should be visible to everyone. Once the cup ends, the ranking freezes and the results are calculated for the top X levels.

A problem with this approach is that it will favor trivial, easy and short levels over complex levels that are harder or longer to finish. Short easy levels will certainly get more finishers than hard or long levels. This doesn't seem to be straightforward to avoid without manually censoring unwanted types of levels. 

#### 2. Only top X levels count in the result, using PRs ranking.
Rank levels in a descending order, with the following calculation per level:
- Sum all unique PRs on the level, meaning that shadow PRs don't count. This is to avoid favoring trivial levels where usually many players have the same PRs (e.g. Tutor1.lev).
- Calculate the average PR and remove all PRs that are over this average. This is to avoid favoring long spam PRs (e.g. someone has a PR of 60 minutes in a 3 seconds level).
- Calculate the level total rank by summing all the remaining PRs.

Example: 

<table><thead><tr><th>Level</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>Total</th><th>Average</th><th>Result</th><th>Rank</th></tr></thead><tbody><tr><td>Lvl 1</td><td>3:50</td><td>3:60</td><td>3:90</td><td><strike>3:90</strike></td><td><strike>3:90</strike></td><td><strike>60:59:59</strike></td><td>61:10:59</td><td>15:17:64</td><td>11:00</td><td>3</td></tr><tr><td>Lvl 2</td><td>10:00</td><td>10:50</td><td><strike>11:00</strike></td><td></td><td></td><td></td><td>31:50</td><td>10:50</td><td>20:50</td><td>2</td></tr><tr><td>Lvl 
3</td><td>21:00</td><td></td><td></td><td></td><td></td><td></td><td>21:00</td><td>21:00</td><td>21:00</td><td>1</td></tr></tbody></table>

In this example, the `Lvl 3` is the top ranked level even though it only has 1 finish (1 PR). The `Lvl 1` is last in 3rd position, even though it is the level with most PRs including the longest PR by far. This is because the shadow PRs are not counted in the calculations, plus the long spam PR is finally ignored since it's above the average.

This approach favors longer levels over short ones. The problem is that if someone were to submit a really long level (like a 60 min level) right before the cup ends, and be the only one to finish it, that kuski will secure a 1st position without competitors in that event.

#### 3. Levels ranking with PRs, ignoring times above 2x best time.

Rank levels in a descending order, with the following calculation per level:
- Sum all unique PRs on the level but substract all PRs that are above 2x times the best time. For example, if the best time is 10 seconds, times above 20 seconds are ignored in the calculation. This is again, to ignore long spam finishes.
- Rank by descending order and take only the top X levels for the result.

Examples:

<table><thead><tr><th>Level</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>Total</th><th>Rank</th></tr></thead><tbody><tr><td>Lvl 1</td><td>3:50</td><td>3:60</td><td>3:90</td><td><strike>3:90</strike></td><td><strike>3:90</strike></td><td><strike>60:59:59</strike></td><td>11:00</td><td>3</td></tr><tr><td>Lvl 2</td><td>10:00</td><td>10:50</td><td>11:00</td><td></td><td></td><td></td><td>31:50</td><td>1</td></tr><tr><td>Lvl 3</td><td>21:00</td><td></td><td></td><td></td><td></td><td></td><td>21:00</td><td>2</td></tr></tbody></table>

Here the trivial short level gets the lowest rank again. But the longest level is not in the first position anymore like in the previous example. Only 1 finish was not enough to win over a half long level with more finishes. 

This gets closer to fix the problem of favoring too much the longest levels over short ones, but might not solve it entirely. At the end of the cup, short and long levels might get rougly the same amount of finishers, and longer levels will certainly have an advantage on the ranking.

Examples: 
- [Count all PRs](/scripts/summaries/summary_prs.md)
- [Count unique PRs](/scripts/summaries/summary_unique_prs.md)
- [Compare both](/scripts/summaries/summary_comparison_prs.md)

#### 4. Levels ranking with all times, ignoring times above 2x best time.

The previous approach might be favoring the very long levels too much over normal and short levels, plus there might be another issue. Counting only the best times (PRs) for a level ends penalizing in some way the energy put into it by its players. By playing more, they make lower PRs and the level's ranking also decreases. When instead, the ranking should favor levels that people like playing more.

Instead of counting only the PRs made, we can count all times made. The more the players play, the more times the level has and the better it ranks. Even though their times might get better over time, they keep summing to the rank of the level. Investing more time into the level means having more chances to have it reach the top X.

Examples:
- [Count all times](/scripts/summaries/summary_all.md)
- [Count unique all times](/scripts/summaries/summary_unique_all.md)
- [Compare both](/scripts/summaries/summary_comparison_all.md)

The new potential problem is that the number of kuskis that finishes is not directly taken into account anymore in the equation. Previously we had only PRs, 1 kuski 1 time. Now there could be only 1 kuski playing the level, making hundreds of times. Although multiple kuskis playing level A could easily outpace the number of finishes against a single kuski playing another level B.

There is still another potential issue (spotted by Lousku), being that this ranking incentivises players to finish their rides even if the rides are not really good from the start, just to make another record for the level. 

Comparison of number of finishes and ranking per average time in level:
<table>
  <thead><tr>
    <th>Average time</th>
    <th># finishes</th>
    <th>Rank</th>
  </tr></thead>
  <tbody>
    <tr><td>10 sec</td><td>10.0000</td><td>100.000</td></tr>
    <tr><td>1 min</td><td>1.667</td><td>~100.000</td></tr>
    <tr><td>2 min</td><td>834</td><td>~100.000</td></tr>
    <tr><td>3 min</td><td>556</td><td>~100.000</td></tr>
    <tr><td>5 min</td><td>334</td><td>~100.000</td></tr>
    <tr><td>10 min</td><td>167</td><td>~100.000</td></tr>
    <tr><td>20 min</td><td>84</td><td>~100.000</td></tr>
    <tr><td>30 min</td><td>56</td><td>~100.000</td></tr>
    <tr><td>1 hour</td><td>28</td><td>~100.000</td></tr>
  </tbody>
</table>

10.000 finishes in a 10 seconds level ranks approx. the same as 28 finishes in an 1 hour level.

[Comparison examples of PRs vs all times](/scripts/summaries/summary_comparison.md), counting PRs only or counting all times finished (plus counting shadow times or not).


## Spam levels

Someone can spam 100 levels in one day. 

Possible solutions:
#### Limit the amount of levels a player can upload to the cup.
#### Limit the number of levels a player can upload per day or week.
#### Upload fee.
Players start with X points (let's say 50), and uploading a level to the cup costs 25 points.
If your level ends up in the top X, you get 50 points for it (double the investment). 
A rule like this could incentivise players to submit levels, but also to think twice before submitting.

## Levels manual validation

How to quickly validate that levels are not old levels, or that the submitter is actually the designer of the level? Should there be a penalty if this rule is broken by someone? Should the event be cancelled, removed, filtered out of the ranking?

## Remixed levels

Should the cup allow remixed levels? This could allow players to do small edits to an ongoing level and re-upload it as a remix, so the answer is probably not.

## Technical limitations

Currently the cup would require some manual orchestration. This management will be centralized as opposed to the cup levels on which anyone can collaborate with. This centralized person or group of persons will be the cup admins.

The cup must be managed by the admins in elma.online and/or somewhere else. The duration must be set from the beginning.

The levels ranking should be visible to everyone all the time and updated regularly by the admins, shared at elma.online, a dedicated website and/or Discord?

As in a normal cup:
- Only freshly new levels are accepted, this must be validated manually.
- Accepted levels must be manually renamed in sequential order by an admin and uploaded to the cup as a new event with the same deadline as the cup's deadline.
- Levels and times must be hidden at EOL.
- Optionally the cup could require uploading replays. This could be annoying to the players depending on how things play out.
