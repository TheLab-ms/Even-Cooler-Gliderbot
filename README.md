# [WIP] Glider Bot

The un-offical Discord Bot for TheLab.ms 

## Setup
### Prerequisites
- Node.js 18.0.0 or higher

### Installation
1. Clone the repository

```bash
git clone ...
```

2. Install dependencies

```bash
npm install
```

3. Run the config command

```bash 
npm run config
```

4. (Optional) Start the docker-compose file to start a dummy octoprint server

```bash
docker-compose up -d
```

1. Edit the .env and config.json files
    - Configure your Discord Bot Token, Client ID & Guild ID in the .env file
    - (Optional) Configure your printer settings in the printerconfig.json file
  
2. Run the config command to set the printer config

```bash
npm run config
```

7. Start the bot

```bash
npm run start
```
