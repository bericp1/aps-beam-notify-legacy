# `aps-beam`

A simple script that runs forever and hits a Slack Incoming Webhook whenever the "Operations Status"
changes for the Argonne National Lab Advanced Photon Source.

Scrapes this web page: https://www3.aps.anl.gov/aod/blops/status/srStatus.html

## Prereqs

- Node 12+
- [Yarn](https://yarnpkg.com/getting-started/install)

## Setup

Simply run the following in the project root to install dependencies.

```bash
yarn
```

## Running

The slack webhook is pulled from the environment variable `SLACK_WEBHOOK_URL`. Create an Incoming Webhook
in the slack admin panel and then to run the script (e.g. in a unix-like shell, macOS, linux, etc.)
(be sure to replace the URL with your own slack webhook URL):

```bash
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/ABCDEFG1234/ABCDEFG1234/000000000000000000000000"
node index.mjs
```
