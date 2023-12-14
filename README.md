# Identify a user by how they type text

A product that shows you how similar your typing is to other users!

Each time you type, we record your keystrokes, including their timestamps. Once you submit your text, we compare your typing pattern with that of other users and present you with a list of users whose typing styles are most similar to yours.

Currently, the similarity in typing is calculated based on the time interval between keystrokes (i.e., the smallest difference in milliseconds). This approach is somewhat simplistic, as it essentially measures words-per-minute (WPM), a metric that many users may share.

## Future Modifications

- [ ] Improve the overall user experience of the product.
- [ ] Expand the criteria beyond just the interval between keystrokes, for instance
  - [ ] Common mistakes when typing.
  - [ ] The time between characters/words.
  - [ ] How accurate the characters are against the passage typed.
- [ ] Use an ML model that can "learn" the features of the raw data from the user's typing, making it possible to "predict" which other users type similarly.
- [ ] Provide users with statistics derived from their raw data, such as typical mistakes, and offer tips and practice exercises to improve those areas.
- [ ] Leaderboard showing the users that type the fastest.

## Getting started, locally

```bash
# Install deps.
bun i

# Start dev.
docker compose up -d
bun dev
```
