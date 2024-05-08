const Socket = (function() {
    // This stores the current Socket.IO socket
    let socket = null;

    // This function gets the socket from the module
    const getSocket = function() {
        return socket;
    };

    // This function connects the server and initializes the socket
    const connect = function() {
        socket = io();

        // Wait for the socket to connect successfully
        socket.on("connect", () => {
            // Get the online user list
            socket.emit("get users");

            // Get the chatroom messages
            socket.emit("get messages");
        });

        // Set up the users event
        socket.on("users", (onlineUsers) => {
            onlineUsers = JSON.parse(onlineUsers);

            // Show the online users
            OnlineUsersPanel.update(onlineUsers);
        });

        // Set up the add user event
        socket.on("add user", (user) => {
            user = JSON.parse(user);

            // Add the online user
            OnlineUsersPanel.addUser(user);
        });

        // Set up the remove user event
        socket.on("remove user", (user) => {
            user = JSON.parse(user);

            // Remove the online user
            OnlineUsersPanel.removeUser(user);
        });

        // Set up the messages event
        socket.on("messages", (chatroom) => {
            chatroom = JSON.parse(chatroom);

            // Show the chatroom messages
            ChatPanel.update(chatroom);
        });

        // Set up the add message event
        socket.on("add message", (message) => {
            message = JSON.parse(message);

            // Add the message to the chatroom
            ChatPanel.addMessage(message);
        });

        // Set up the typing event
        socket.on("typingAlert", (typingUser) => {
            typingUser = JSON.parse(typingUser);
            typerField.displayTyper(typingUser);
        });

        socket.on("game started", () => {
            $("#game-start").hide();
            $("#start-button").show();
            
        });

        socket.on("stop game", () => {
            $("#game-start").show();
            $("#start-button").hide();
            
        });

        //Set up the posting check drink result event
        socket.on("post check result", (player, drinkName, result) => {
            console.log("player: ", player, ", drink name: ", drinkName, ", post check result: ", result);
            const you = Authentication.getUser();
            if (result==="success") {
                if (JSON.stringify(you) === JSON.stringify(player)) { // you got a point
                    const currentNumber = parseInt($("#points_s").text());
                    $("#points_s").text(currentNumber + 1);
                }
                else { // the opponent got a point
                    const currentNumber = parseInt($("#points_o").text());
                    $("#points_o").text(currentNumber + 1);
                }
            }
            // if the result is not success, do nothing
        });
    };

    // This function disconnects the socket from the server
    const disconnect = function() {
        socket.disconnect();
        socket = null;
    };

    // This function sends a post message event to the server
    const postMessage = function(content) {
        if (socket && socket.connected) {
            socket.emit("post message", content);
        }
    };

    // This function sends a typing event to the server
    const isTyping = function(typingUser) {
        socket.emit("typingAlert", typingUser);
    };

    // This function sends a check event to the server
    const checkDrink = function(drinkName, playerRecipe) {
        socket.emit("check drink", drinkName, playerRecipe);
    };

    const checkUserCount = function() {
        //if(OnlineUsersPanel.countUser())
        socket.emit("start game");
        };

    return { getSocket, connect, disconnect, postMessage, isTyping, checkDrink, checkUserCount };
})();
