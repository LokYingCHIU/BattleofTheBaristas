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

        socket.on("game started", () => {
            $("#game-start").hide();
            startGame();
        });

        socket.on("stop game", () => {
            $("#signin-overlay").fadeIn(500);
            sounds.background.pause();
            sounds.collect.pause();
            sounds.gameover.play();
        });

        //Set up the posting check drink result event
        socket.on("post check result", (player, drinkName, result) => {
            const you = Authentication.getUser();
            console.log("you: ", JSON.stringify(you), ", player: ", player, ", drink name: ", drinkName, ", post check result: ", result);
            if (result==="success") {
                if (JSON.stringify(you) === JSON.stringify(player)) { // you got a point
                    const currentNumber = parseInt($("#points_s").text());
                    $("#points_s").text(currentNumber + 1);

                    if(drinkName == "matcha-latte"){
                        $("#matcha-latte").show();
                        $("#matcha-latte").fadeOut(500);
                    }
                    else if(drinkName == "latte" || drinkName == "mocha" || drinkName == "milk-tea"){
                        $("#latte").show();
                        $("#latte").fadeOut(500);
                    }
                    else if(drinkName == "lemonade"){
                        $("#lemonade").show();
                        $("#lemonade").fadeOut(500);
                    }
                    else if(drinkName == "choco-milk"){
                        $("#chocmilk").show();
                        $("#chocmilk").fadeOut(500);
                    }
                    else if(drinkName == "milkshake"){
                        $("#milkshake").show();
                        $("#milkshake").fadeOut(500);
                    }

                    // play the complete drink sound
                    sounds.complete_drink.pause();
                    sounds.complete_drink.currentTime = 0;
                    sounds.complete_drink.play();

                    // assign new drink
                    cur_drink = drinks[Math.floor(Math.random() * 7)];
                    $("#ordered-item").text(cur_drink);
                    $("#hint-content").text("");
                    
                }
                else { // the opponent got a point
                    const currentNumber = parseInt($("#points_o").text());
                    $("#points_o").text(currentNumber + 1);
                }
            }
            else{
                // if your result is not success, show cross
                if (JSON.stringify(you) === JSON.stringify(player)) {
                    $("#cross-mark").show();
                    $("#cross-mark").fadeOut(500);
                }
            }
            
        });
    };

    // This function disconnects the socket from the server
    const disconnect = function() {
        socket.disconnect();
        socket = null;
    };

    // This function sends a check event to the server
    const checkDrink = function(drinkName, playerRecipe) {
        socket.emit("check drink", drinkName, playerRecipe);
    };

    const checkUserCount = function() {
        //if(OnlineUsersPanel.countUser())
        socket.emit("start game");
        };

    return { getSocket, connect, disconnect, postMessage, checkDrink, checkUserCount };
})();
