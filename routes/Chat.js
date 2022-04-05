const express = require('express');
const { json } = require('express/lib/response');
const router = express.Router();

const { mongoose } = require('../db/mongoose');
const { Chat }  = require("../models/Chat");
const { User } = require('../models/User')

const log = console.log;

//TODO: need to check for current logged in user (done)
//TODO: check if the user that the person is trying to message exists before messaging

const createNewChat = async (user1, user2) => {
    const chat = new Chat ({
        personOne: user1,
        personTwo: user2,
        messages: []
    });

    try {
        const newChat = await chat.save();
        return Promise.resolve(newChat);
    } catch {
        return Promise.reject();
    }
    
}

const sendMessage = async (senderUsername, recipientUsername, messageContents) => {
    let chat = await Chat.findChatsBetweenUsers(senderUsername, recipientUsername);
    if (!chat) {
        chat = await createNewChat(senderUsername, recipientUsername);
        //log(chat)
    }

    return chat.addMessage(senderUsername, messageContents);
}

const getProfilePic = async (username) => {
    const user = await User.findOne({userName: username}).exec();
    if (user) return user.avatarImg;
    else return null;
}

const doesUserExist = async (username) => {
    const user = await User.findOne({userName: username}).exec();
    return user !== null;
}

//formats chats (document) array to be used by the frontend for Messages page
//assumes chats is an array
//useOne decides whether or not to only use the last message between each chat or not
//singleUser decides whether or not to just send the first user in the array (no messageState return)
//if chats is a single document, it must be wrapped in an array
const formatChatsForFrontend = async (username, chats, useOne=false, singleUser=false) => {
    const messagesState = {//TODO: remove messagesState and currentTab
        currentTab: 0,
        users: []
    };
    for (let i=0; i<chats.length; i++){
        const c = chats[i]
        const otherUser = c.personOne === username? c.personTwo : c.personOne;

        const user = {
            name: otherUser,
            profilePic: await getProfilePic(otherUser),
            textfieldValue: "",
            messages: []
        }

        if (useOne){
            let msg = {
                sender: "none",
                msgContents: "(error)",
                when: "(error)"
            };
            if (c.messages.length > 0) msg = c.messages[c.messages.length-1];
            
            const fMsg = {
                isOutgoing: username === msg.sender,
                timestamp: msg.when,
                contents: msg.msgContents
            }
            user.messages.push(fMsg);
        } else {
            for (let j=0; j<c.messages.length; j++){
                const msg = c.messages[j];
                const fMsg = {
                    isOutgoing: username === msg.sender,
                    timestamp: msg.when,
                    contents: msg.msgContents
                }
                user.messages.push(fMsg);
            }
        }

        messagesState.users.push(user);
        
        if (singleUser) return user;
    }

    return messagesState.users;
}

// middleware for mongo connection error for routes that need it
const mongoChecker = (req, res, next) => {
	// check mongoose connection established.
	if (mongoose.connection.readyState != 1) {
		log('Issue with mongoose connection');
		res.status(500).send('Internal server error');
		return;
	} else {
		next();
	}	
}

//middleware for checking if user is logged in
const loggedInChecker = (req, res, next) => {
    //log(req.session)
	if (!req.session.userName) {
		log('Unauthorized Access');
		res.status(401).send('Unauthorized');
		return;
	} else {
		next();
	}
}


function isMongoError(error) { // checks for first error returned by promise rejection if Mongo database suddently disconnects
	return typeof error === 'object' && error !== null && error.name === "MongoNetworkError"
}

//get all chats involving the current logged on user
router.get('/', loggedInChecker, mongoChecker, async (req, res) => {
    try {
        const username = req.session.userName;//req.body.username;
		const chats = await Chat.findChatsWithUser(username);

        res.json(chats);
	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}
});

//get all chats involving the current logged on user (formatted for frontend)
router.get('/f', loggedInChecker, mongoChecker, async (req, res) => {
    try {
        const username = req.session.userName;//req.body.username;
		const chats = await Chat.findChatsWithUser(username);
        const fchats = await formatChatsForFrontend(username, chats);
        
        res.json(fchats);
	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}
});

// a POST route send a message
// uses session to get username of logged in user, uses body to get recipient username and message contents
router.post('/', loggedInChecker, mongoChecker, async (req, res) => {
	// log(req.body)

    const ourUsername = req.session.userName;//req.body.username;
    const recipientUsername = req.body.recipient;
    const msgContents = req.body.messageContents;

	try {
        if (!doesUserExist(recipientUsername)) res.status(400).send("User does not exist");
		const msg = await sendMessage(ourUsername, recipientUsername, msgContents);
        res.json(msg);
	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}

});

//get all chats involving the current logged on user and another user
router.get('/u/:otherUsername', loggedInChecker, mongoChecker, async (req, res) => {
    try {
        const username = req.session.userName;//req.body.username;
        const otherUsername = req.params.otherUsername;
        if (!doesUserExist(otherUsername)) res.status(400).send("User does not exist");

		const chats = await Chat.findChatsBetweenUsers(username, otherUsername);

        res.json(chats);
	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}
});

//get all chats involving the current logged on user and another user (formatted for frontend)
router.get('/f/u/:otherUsername', loggedInChecker, mongoChecker, async (req, res) => {
    try {
        const username = req.session.userName;//req.body.username;
        const otherUsername = req.params.otherUsername;
        if (!doesUserExist(otherUsername)) res.status(400).send("User does not exist");

		const chats = await Chat.findChatsBetweenUsers(username, otherUsername);
        const fchats = await formatChatsForFrontend(username, [chats], false, true);
        res.json(fchats);
	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}
});

//get last message from each chat for logged in user (for chat message preview tabs)
router.get('/recent', loggedInChecker, mongoChecker, async (req, res) => {
    try {
        const username = req.session.userName;//req.body.username;

		const chats = await Chat.findChatsWithUser(username);

        const recents = [];
    
        for (let i=0; i<chats.length; i++){
            const c = chats[i]
            let lastMsg = {
                sender: username,
                msgContents: "",
                when: ""
            };
            if (c.messages.length > 0) lastMsg = c.messages[c.messages.length-1];

            const otherUser = c.personOne === username? c.personTwo : c.personOne;
            recents.push({
                username: otherUser,
                msgContents: lastMsg.msgContents,
                timestamp: lastMsg.when
            });
        }
        res.json(recents);
         
	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}
});

//get last message from each chat for logged in user (for chat message preview tabs)
router.get('/f/recent', loggedInChecker, mongoChecker, async (req, res) => {
    try {
        const username = req.session.userName;//req.body.username;

		const chats = await Chat.findChatsWithUser(username);
        
        const recents = await formatChatsForFrontend(username, chats, true);
        res.json(recents)
        
	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}
});

//delete all chats involving a certain user (logged in version, for deleting your own account)
router.delete('/', loggedInChecker, mongoChecker, async (req, res) => {
    try {
        const username = req.session.userName;//req.body.username;
		const chats = await Chat.deleteChatsWithUser(username);
        res.json(chats);
	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}
});


//ADMIN ONLY BELOW

// middleware for checking if an adimin is logged in for routes that need it
// USE AFTER CHECKING IF LOGGED IN, OTHERWISE WRONG STATUS CODE IS SENT (403 INSTEAD OF 401)
const adminChecker = (req, res, next) => {
	if (!req.session.isAdmin) {
        log('Forbidden Access');
		res.status(403).send('Forbidden');
		return;
    } else {
		next();
	}	
}

//delete all chats involving a certain user (admin version, for deleting other accounts)
router.delete('/u/:username', loggedInChecker, adminChecker, mongoChecker, async (req, res) => {
    if (!req.session.isAdmin) res.status(403).send("unauthorized");
    try {
        const username = req.params.username;
        if (!doesUserExist(username)) res.status(400).send("User does not exist");
		const chats = await Chat.deleteChatsWithUser(username);
        res.json(chats);
	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}
});

//get all chats
router.get('/all', loggedInChecker, adminChecker, mongoChecker, async (req, res) => {
    try {
		const chats = await Chat.find().sort({updatedAt: 'desc' }).exec();
        res.json(chats);
	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}
});

//FOR CONVENIENCE: TODO: DELETE ALL ENDPOINTS BELOW =====================================

//clear chats db
router.delete('/all', loggedInChecker, adminChecker, mongoChecker, async (req, res) => {
    try {
		const chats = await Chat.deleteMany({});
        res.json(chats);
	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}
});

//check session
router.get('/session', (req, res) => {//TODO: remove
    try {
        if (req.session.isAdmin)
        res.json(req.session.isAdmin);
        else 
        res.json("no")
	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}
});

router.get('/checkuser/:username', async (req, res) => {//TODO: remove
    try {
        const answer = await doesUserExist(req.params.username);
        log(answer)
        res.json(answer)
	} catch(error) {
		log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // 400 for bad request gets sent to client.
		}
	}
});


module.exports = router;