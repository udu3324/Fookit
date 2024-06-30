# fookit
fookit is a cooperative kitchen game where you have to cook in synchronous with your partner. I decided to stop developing this as it was built a bit janky. It will be replaced by Kitchit instead. The codebase serves as inspiration for me.
  

## Libraries
It uses socket io for handling s2c actions, tailwindcss for nice styling, and express.

## How to Run
 1. Do `npm install` to install your dependencies
 2. Optional: `npx tailwindcss -i ./public/css/index.css -o ./public/css/output.css --watch` to update css on changes
 3. Finally, run `nodemon server.js` to refresh the server when there's a change

## What it looks like
I know it does not look great, but I was mainly focusing on server validation stuff first.
