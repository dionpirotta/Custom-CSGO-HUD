# CS:GO Observer Custom HUD

Based off a fork from [osztenkurden](https://github.com/osztenkurden)

Update: Hi all, osztenkurden, myself and many others are working on a completely new tool that will be much better than this current one. Please stay tuned for it, we are working on it in spare time as we don't get paid for this.

# Disclaimer

I am making this a free available download for you so please don't go saying you created this.
Best contact is [Twitter](https://twitter.com/KomodoAU). 
Also, any support would be greatly appreciated for the time I have spent on this project!

[![Paypal donate](https://www.paypalobjects.com/en_US/PL/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=CUYNSHWEEC2HG&currency_code=AUD&source=url)

# Examples

![Ex1](https://i.imgur.com/u70Z8XJ.png)
![Ex2](https://i.imgur.com/Ok5Jm1V.png)

## How does it work?

Basically, CS:GO is streaming data to local app-server, that transforms data and then load it to local webpage.

## To-do before running

- Node.js needs to be installed
- public/files/cfg/gamestate_integration_observerspectator.cfg needs to be placed in cfg folder in CS:GO location
- public/files/cfg/observer.cfg needs to be placed in cfg folder in CS:GO location
- CS:GO needs to run on Fullscreen Windowed (I know people may dislike it, but since it's only for observation, soo...)
- After running CS:GO and connecting to match (or replaying a demo, you can use this in it too), type to console `exec observer.cfg`, it makes everything default disappear besides map and killfeed (can use `exec observer_off.cfg` to turn back to normal)
- Ensure everything in the `config.json` file is filled out

## Configuration

```javascript
//config.json
{
    "GameStateIntegrationPort":1337, //This must be the same as in gamestate_integration_observerspectator.cfg,
    "ServerPort":2626, //Some free port on your PC
    "SteamApiKey":"ABCDEFGIJK12345678", //Steam API Key, without it avatars won't work
    "PrintPlayerData": false, // Useful for seeing steamid of players in the game to add to players database
    "DisplayAvatars": true, // Display Obs Avatars
    "DisplayPlayerAvatars": false, // Display custom set player avatars from the players database
    "DisplayTeamFlags": false, // Display team flags under the team rounds score
    "DisplayPlayerFlags": true, // Display players flag on the observed player section
    "DisplayAvatars": false, // true for yes, false for no
    "AvatarDirectory":"./public/files/avatars/", // Local storage for avatars
    "SpecialEvent": "SHOWMATCH", // If create match type is set to NONE, it will use this text - used for something else, just leave alone
    "LeftImage": "/files/league/blah.png", // Left Section Image
    "LeftPrimary": "Left Primary Text", // left Section Top Words
    "LeftSecondary": "Left Secondary Text", // Left Section Bottom Words
    "RightImage": "/files/img/elements/icon_microphone.png", // Right Section Image
    "RightPrimary": "Right Primary Text", // Right Section Top Words
    "RightSecondary": "Right Secondary Text", // Right Section Bottom Words
    "GSIToken":"120987" //This must be the same as in gamestate_integration_observerspectator.cfg
}
```

## How to make it run?

- Install NodeJS (nodejs.org)
- Download this repo somewhere
- Start RUN file (.bat for Windows, .sh for Linux)
- Run Overlay Exe from here: [OVERLAY DOWNLOAD](https://drive.google.com/file/d/1uByNiYqkzGJ-8JftDrm29XTUM0En375_/view?usp=sharing)
- Ensure that in the Overlay exe folder, there is a config.json file with the following:

```javascript
//config.json
    {
        "port": 2626 // same port as ServerPort as stated in the 'big' config.json file above
    }
```

## Admin Panel

After starting the code go to address showing up in terminal/command prompt. You should see Admin Panel divided in three parts - Teams, Players, Create Match and HUDs. In here you can manage data used in HUDs during match ups.

#### Teams tab

You can here define teams, their name, short names (actually short names are not use anywhere for now), their country flag and logo. Files for teams' logos are being held in `public/storage/` and their filename should start from `logo-`.
![Ex1](https://i.imgur.com/XKkRXFR.png)

#### Players tab

In Players tab you can define player's real name, displayed name, country flag (can also be set to "The same as team"), their team and, to identify players, SteamID64. Files for players' avatars are being held in `public/storage/` and their filename should start from `avatar-`.
![Ex2](https://i.imgur.com/XHJOLJ0.png)

#### Create match tab

Here you can set type of match - is this a map of NONE, BO1, BO3 or BO5, score for teams and which team it should load to HUD. In case players are on the wrong side (left/right) there is `SWAP` button to quickly tell the HUD to swap teams' name, logo and flag.
Additionaly, if during the match you decide that there is a type in team's or player's information, you can change it (for example on mobile phone, if you allow Node through firewall and you are on the same local network) and then in this tab click the `Force Refresh HUD`, to make sure all the changes are applied.
![Ex3](https://i.imgur.com/QgIbw6U.png)

### HUDS

This tab shows local HUDs. They are not validated whether or not they actually work, but if any of the files is missing, it will notify you in Warnings column.
You can enable/disable each HUD to make it accessible or not. There is also HUD URL information - if you click it, it will redirect you to local webpage, that's serving as a HUD. It is useful if streamer wants to stream HUD separately - for example it can be added in OBS as Browser Source, then you just need to set it to HUD's URL.
It might be useful for bigger streaming workspaces, like for setups with different PC dedicated to replays - one server app will manage every HUD on local network, because all HUDs are available all the time, if they are not disabled.
![Ex4](https://i.imgur.com/dKFmxbT.png)

## Credits

[osztenkurden](https://github.com/osztenkurden) - Original Repo Creator

## License

This project is Licensed under GPL-3. Any changesd to this project need to be made open source (among other things). Distribution is allowed, but must be open (not closed or behind paywall).

The section above is not legal advice and is not legally binding. See the LICENSE file in the repository for the full license.
