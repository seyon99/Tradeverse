import { SERVER_URL } from "../env";

const setEmptyMessagesState = (messagesComp) => {
    messagesComp.setState({
        currentTab: 0,
        users: [
            {
                name: "<N/A>",
                textfieldValue: "",
                messages: []
            }
        ]
    });
}

export const getAllMessages = (messagesComp) => {
    const url = `${SERVER_URL}chat/f`;

    fetch(url)
        .then(res => {
            if (res.status === 200) {
                // return a promise that resolves with the JSON body
                return res.json();
            } 
        })
        .then(json => {
            // the resolved promise with the JSON body
            let index = -1
            if (json){
                console.log(json)
                
                messagesComp._addArrayOfUsers(json, false);
                return index;
            } else {
                return index;
                //return true;
            }
        })
        .catch(error => {
            console.log(error);
            return -2;
        });
};

// A function to send a POST request to send a message
export const postMessage = (msgContents, recipientUsername, messagesComp, uid) => {
    // the URL for the request
    const url = `${SERVER_URL}chat`;

    // The data we are going to send in our request
    const message = {
        recipient: recipientUsername,
        messageContents: msgContents
    }

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "post",
        body: JSON.stringify(message),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    // Send the request with fetch()
    fetch(request)
        .then(function (res) {
            messagesComp.sendMessage(msgContents, uid, (res.status === 200));
            return true;//true if message was sent, false otherwise
        })
        .catch(error => {
            messagesComp.sendMessage(msgContents, uid, false);
            console.log(error);
            return false;
        });
};

//starts a new chat or updates chat's updatedAt field
export const startNewChat = (recipientUsername, callback=null) => {
    // the URL for the request
    const url = `${SERVER_URL}chat`;

    // The data we are going to send in our request
    const message = {
        recipient: recipientUsername,
        messageContents: null
    }

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "post",
        body: JSON.stringify(message),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    // Send the request with fetch()
    fetch(request)
        .then(function (res) {
            if (callback) callback();
            return true;
        })
        .catch(error => {
            console.log(error);
            return false;
        });
};