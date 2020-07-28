TeamCity Slack Bot
=====================

Production Usage
-----------------------------------
1. Create a site with this project in IIS Manager and run it.
2. Set webhook in TeamCity (`tcWebHooks` plugin) for some build to `<IISNodeSiteURL>/teamcity-webhook` handle.
3. Bind build name with `Slack` channel name in `.\src\services\storage\channelBuild.json` array.
It should be an object with this structure: `{ "channel": "ChannelNameString", "build": "BuildNameString" }`
4. Start `IISNode` app.
5. Start build.


Development Usage
-----------------------------------
1. Set webhook in TeamCity (`tcWebHooks plugin`) for some build to `localhost:9000/teamcity-webhook` handle.
2. Bind build name with `Slack` channel name in `.\src\services\storage\channelBuild.json` array.
   It should be an object with this structure: 
   `{ "channel": "ChannelNameString", "build": "BuildNameString" }`
3. `npm run start_app` to start bot.
4. Start build.


Tests
-----------------------------------
First of all, you need to download the `steno` tool from official page https://slack.dev/steno/ to work with system tests.
Write the path to it in `PATH` environment variable.

### NPM Scripts
    `test:unit` - starts unit tests;
    `test:integration` - starts integration tests;
    `test:system` - starts system tests;
    `test` - starts all above tests;

###Create Scenarios:
There is opportunity to create system tests for use cases (scenarios):
* `npm run steno:create_record` starts listening requests and writing responses to/from Slack;
* `npm run start_app` starts bot in `dev mode`;
* start specific build/builds from `TeamCity`;
* close `Steno` on finish build/builds; 
* ready to run `test:system`

There is `.\__tests__\system\slack\steno\snapshots\snapshots.json` with `TeamCity` requests and bot's responses;
There is `.\__tests__\system\slack\steno\scenarios` with steno's scenarios;

###Update Scenarios
It is also possible to update all existing `scenarios`:
* `npm run steno:update_record` update scenarios. It uses requests from `snapshots.json` storage.