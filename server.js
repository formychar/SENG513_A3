var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
offlineUsers = [];
connections = [];
var count = 0;
var chatLog = "Welcome to Chat App! </br>";

var user = {
    msg : "",
    user_name : "",
    time : "" ,
    color: ""
    };




server.listen(3000);
console.log("Server Running ...");
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");

});

io.sockets.on("connection", function (socket) {
    connections.push(socket);


    console.log("Connected: %s sockets connected", connections.length);
    socket.tabs = 1;
    chatLog = chatLog.replace(/undefined/g, "white");
    io.sockets.emit("sync", chatLog);

    socket.on("disconnect", function (data) {
        socket.tabs -= 1;
        if(socket.tabs < 1){
            users.splice(users.indexOf(socket.username), 1);
            updateUsernames();
        }
        connections.splice(connections.indexOf(socket), 1);
        console.log("Disconnected: %s sockets connected", connections.length);
    });
    
    socket.on("send message", function (data) {
        var d = new Date();
        hours = d.getHours();
        mins = d.getMinutes();
        if(mins <10){
            mins = "0"+ mins;
        }
        final = hours + ":"+ mins;


        user.msg = data;
        user.time = final;
        user.user_name = socket.username;
        user.color = socket.color;
        if(typeof user.color == "undefined"){
            user.color = "white";
        }
        chatLog += final +"  "+"<font color="+user.color+">" +socket.username +"</font>"+ ": "+data+"</br>";
        for(i = 0; i<connections.length; i++){
            if(connections[i] != socket){
                io.to(connections[i].id).emit("new message", user);
            }

        }
        user.msg = "<b>"+data+"</b>";
        io.to(socket.id).emit("new message", user);





    });

    socket.on("new user", function (data) {
        uname = data+count;
        while(offlineUsers.indexOf(uname) > -1){
            count++;
            uname = data+count;
        }

        socket.username = data+count;
        count++;
        users.push(socket.username);
        offlineUsers.push(socket.username);
        updateUsernames();
        io.to(socket.id).emit("add cookie", socket.username);
        io.to(socket.id).emit("get username", {usr : socket.username});

        console.log(offlineUsers);

    });

    socket.on("existing user", function (data) {
        socket.username = data;
        if(!(users.indexOf(data) > -1)) {
            users.push(data);
        }
        else{
            socket.tabs += 1;
        }

        updateUsernames();
        io.to(socket.id).emit("get username", {usr : socket.username});
    });

    socket.on("set color", function (color) {
        socket.color = color;
        //updateLogColor(socket.color, socket.username);
    });
    
    socket.on("syncColors", function () {
        io.sockets.emit("sync", chatLog);
    });

    function updateLogColor(color, usrname) {
        //console.log("BEFORE:" + chatLog);

        console.log("Changing all the usernames of "+usrname+" to the color of "+ color);
        var regex = new RegExp(usrname, "g");
        var result = [];
        var match;
        while (match = regex.exec(chatLog))
            result.push(match.index);
        var count = result.length;
        for(i = 0; i<count; i++){

            index = result[i];
            end = index;
            temp = true;


            while(temp){
                if(chatLog.charAt(index) === "="){
                    temp = false;
                }
                else{
                    index = index - 1;
                    if(index < 0){
                        temp = false;
                    }
                }
            }



            //chatLog = replaceRange(chatLog, index+1, end, color);
            console.log("Start char: "+chatLog.charAt(index+1)+ "   End Char: "+ (end-1) + chatLog.charAt(end-1));
            string0 = splitValue(chatLog, end-1);
            test2 = string0.split("%$%");
            string0 =  test2[0].substring(0, index+1);
            string0 += color+test2[1];
            console.log(string0);
            console.log("\n");
            chatLog = string0;
            result = [];
            while (match = regex.exec(chatLog))
                result.push(match.index);
        }
        console.log(chatLog);





    }

    socket.on("set nickname", function (username) {

        if(!(offlineUsers.indexOf(username) > -1)){

            if ( !(users.indexOf(username) > -1) ) {
                offlineUsers.splice(offlineUsers.indexOf(socket.username), 1);
                offlineUsers.push(username);
                old = socket.username;
                users.splice(users.indexOf(socket.username), 1);
                users.push(username);
                socket.username = username;
            }
            io.to(socket.id).emit("get username", {usr : socket.username});
            io.to(socket.id).emit("add cookie", socket.username);
        }


        console.log(offlineUsers);
    });

    socket.on("syncUsers", function () {
        updateUsernames();
    });

    function replaceRange(s, start, end, substitute) {
        return s.substring(0, start) + substitute + s.substring(end);
    }

    function splitValue(value, index) {
        return value.substring(0, index) + "%$%" + value.substring(index);
    }

    function updateUsernames() {
        io.sockets.emit("users", users);
    }

});