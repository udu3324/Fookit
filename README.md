# fookit
fookit is a cooperative kitchen game where you have to cook in synchronous with your partner. This project isn't maintained anymore due to some issues with data storage. I am making a better version though called Kitchit.
  

## Libraries
It uses socket io for handling s2c actions, tailwindcss for nice styling, and express.

## How to Run
 1. Do `npm install` to install your dependencies
 2. Optional: `npx tailwindcss -i ./public/css/index.css -o ./public/css/output.css --watch` to update css on changes
 3. Finally, run `nodemon server.js` to refresh the server when there's a change

## What it looks like
I know it does not look great, but I was mainly focusing on server validation stuff first.   
![sharing code](https://github.com/udu3324/Fookit/assets/47045986/e7a940cc-6910-48a0-ba9b-fed3eed11d7a)       
Players would share their code to others to join. They both have a function to leave and join. The server can also handle players forcefully exiting the game instead of pressing the exit button.   
     
    
![assembling food](https://github.com/udu3324/Fookit/assets/47045986/0c499d49-fdbe-435b-a432-702ebe36a790)     
Desktop and mobile users can hold and drag around ingredients to stack them. I was later on planning to add transformers, things that would transform a ingredient. (bread loaf to slices of bread)    
     
     
![finished product](https://github.com/udu3324/Fookit/assets/47045986/cf9a8f05-dc1b-42a3-baa6-903065939213)    
The server validates the player's ingredient stack by checking if they have all the right ingredients to finish their objective.    
