## Setup:

1. Get your new bot token from [@BotFather](https://t.me/botfather)

2. Deploy code with wrangler cli [Wrangler](https://developers.cloudflare.com/workers/wrangler)
 ```
 npm i
 npx wrangler login
 npm run deploy
 ```

3. Setup envars
 - Retrieve worker url from CF dashboard
 - set local envars:
 ```
 export BOT_TOKEN=XXXXXX
 export BOT_ID=XXXXXX
 export WEBHOOK_URL=XXXXXX
 ```
 - set worker secrets:
 ```
 npx wrangler secret put BOT_ID
 npx wrangler secret put BOT_TOKEN
 ```

4. Setup webhook:
  ```
  bash setup_webhook.sh
  ```
