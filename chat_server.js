const express = require("express");

const bcrypt = require("bcrypt");
const fs = require("fs");
const session = require("express-session");

// Create the Express app
const app = express();

// Use the 'public' folder to serve static files
app.use(express.static("public"));

// Use the json middleware to parse JSON data
app.use(express.json());

// Use the session middleware to maintain sessions
const chatSession = session({
    secret: "game",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 300000 }
});
app.use(chatSession);

// This helper function checks whether the text only contains word characters
function containWordCharsOnly(text) {
    return /^\w+$/.test(text);
}

// Handle the /register endpoint
app.post("/register", (req, res) => {
    // Get(Read) the JSON data from the body
    const { username, avatar, name, password } = req.body;

    //
    // D. Reading the users.json file (DB)
    //
    const users = JSON.parse(fs.readFileSync("./data/users.json"));
    //
    // E. Checking for the user data correctness
    //
    if(!username || !avatar || !name || !password){
        res.json({
            status: "error",
            error: "username/avatar/name/password cannot be empty!"
        });
        return;
    }

    if(!containWordCharsOnly(username)){
        res.json({
            status: "error",
            error: "username should only contain underscores, letters, or numbers!"
        });
        return;
    }

    if(username in users){
        res.json({
            status: "error",
            error: "the username has already been used!"
        });
        return;
    }
    //
    // G. Adding the new user account
    //
    const hash = bcrypt.hashSync(password,10);
    users[username] = {avatar, name, "password": hash};
    //
    // H. Saving the users.json file
    //
    fs.writeFileSync("./data/users.json", JSON.stringify(users, null, " "));
    //
    // I. Sending a success response to the browser
    //
    res.json({status: "success"}); return;
    // Delete when appropriate
    //res.json({ status: "error", error: "This endpoint is not yet implemented." });
});

// Handle the /signin endpoint
app.post("/signin", (req, res) => {
    // Get the JSON data from the body
    const { username, password } = req.body;

    //
    // D. Reading the users.json file
    //
    const users = JSON.parse(fs.readFileSync("./data/users.json"));
    //
    // E. Checking for username/password
    //
    if(!(username in users)){
        res.json({
            status: "error",
            error: "the username does not exist!"
        });
        return;
    }

    //console.log(users[username].hash)
    if (!bcrypt.compareSync(password, users[username].password)) {
        /* Passwords are not the same */
        res.json({
            status: "error",
            error: "incorrect password!"
        });
        return;
    }   
    
    // G. Sending a success response with the user account
    //
    const _avatar = users[username].avatar;
    const _name = users[username].name;
    const _user = {username, "avatar": _avatar, "name":_name};
    req.session.user = _user;
    //res.json({status: "success", user:_user}); 
    res.json({status: "success", user:_user});
    return;
    // Delete when appropriate
    res.json({ status: "error", error: "This endpoint is not yet implemented." }); 
});

// Handle the /validate endpoint
app.get("/validate", (req, res) => {

    //
    // B. Getting req.session.user
    //
    if(!req.session.user){
        res.json({
            status: "error",
            error: "Please log in!"
        });
        return;
    }
    //
    // D. Sending a success response with the user account
    //
    const thisuser = req.session.user;
    res.json({status: "success", user:thisuser}); return;
 
    // Delete when appropriate
    res.json({ status: "error", error: "This endpoint is not yet implemented." });
});

// Handle the /signout endpoint
app.get("/signout", (req, res) => {

    //
    // Deleting req.session.user
    //
    delete req.session.user;
    //
    // Sending a success response
    //
    res.json({status: "success"}); return;
    // Delete when appropriate
    res.json({ status: "error", error: "This endpoint is not yet implemented." });
});


//
// ***** Please insert your Lab 6 code here *****
//
const {createServer} = require("http");
const {Server} = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer);

io.use((socket, next) => {
    chatSession(socket.request, {}, next);
});

const onlineUserList = {};

io.on("connection", (socket) => {
    // Add a new user to the online user list
    if(socket.request.session.user){
        const user = socket.request.session.user;
        const {username, avatar, name} = user;
        onlineUserList[username] = user;
        io.emit("add user", JSON.stringify(user));
    }

    socket.on("disconnect", () => {
        // Remove the user from the online user list
        if(socket.request.session.user){
            const user = socket.request.session.user;
            const {username, avatar, name} = user;
            if(onlineUserList[username]){
                delete onlineUserList[username];
            }  
            io.emit("remove user", JSON.stringify(user));
            //io.emit("users", JSON.stringify(onlineUserList));
        }
    });

    socket.on("get users", () => {
        // Send the online users to the browser
        socket.emit("users", JSON.stringify(onlineUserList));
    });

    socket.on("get messages", () => {
        // Send the chatroom messages to the browser
        const chatroom = JSON.parse(fs.readFileSync("./data/chatroom.json")); 
        socket.emit("messages", JSON.stringify(chatroom));
    });

    socket.on("post message", (content) => {
        // Add the message to the chatroom
        const user = socket.request.session.user;
        const newMessage = {
            user: user,
            datetime: new Date(),
            content:  content
        };

        const chatroom = JSON.parse(fs.readFileSync("./data/chatroom.json")); 
        chatroom.push(newMessage);
        fs.writeFileSync("./data/chatroom.json", JSON.stringify(chatroom, null, " "));
        io.emit("add message", JSON.stringify(newMessage, null, " "));
    });

    socket.on("typingAlert", (typingUser) => {
        // Send the online users to the browser
        io.emit("typingAlert", JSON.stringify(typingUser));
    });
});

// Use a web server to listen at port 8000
//app.listen(8000, () => {
httpServer.listen(8000, () => {
    console.log("The chat server has started...");
});
