
SENG513 Assignment 3
By: Shahab Seyedi
UCID: 10125587
email: sseyedi@ucalgary.ca


READ THIS BEFORE RUNNING:
-------------------------


Common issues:
 - Does not resize to browser size
 - User texts appear in bold for the user when they send it, but after a refresh old messages are no longer bold

Functionality:
 - All assignment functionality is working other than the ones stated above
 - Program assumes that the commands /nick and /nickcolor are used properly. It will not function correctly if the commands are not used properly. 
 - Program was fully tested using Chrome and Firefox
 - Cookies are kept even until after the browser has been shut down so if you need a fresh start you have to clear your cookies. 
 - Openning multiple tabs on the same browser will not create new user as it still contains the same cookie. Multiple users are supported via multiple browsers.

How to setup:
** Ensure cookies are cleared and all previously used tabs are closed before proceeding **
1- Navigate to the main folder thats containing server.js using a console. Note that Node.js must be installed on the system before proceeding to next step.
2- Run the server code by typing the command: node server    *Uppon successful server start, you will see the message "Server Running..."*
3- Open a browser (Tested fully with Friefox and Chrome) and make sure that the browser accepts cookies. In the URL type: localhost:3000
4- You will then see the chat application open up. 

How to use:
- Make sure all tabs are closed and browser cookies are cleared before running the server for a fresh start
- Type everything as usual.
- To change nickname: /nick nickname
- to change color: /nickcolor Red   or /nickcolor ffffff   supports hex without the # and common color names. 

