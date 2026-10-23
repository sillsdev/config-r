# Agent instructions for config-r

## Issue Tracker

config-r is a shared SIL library that more than one app can use, so the tracker depends on the
ticket-id prefix in the branch name:

- `BL-` followed by digits (e.g. `BL-17032`): the Bloom YouTrack tracker, accessed via the
  `youtrack-api` skill.
- Any other prefix, or no id at all: the tracker is unknown; skip any steps that post to a card.
