import { TextField, Button } from '@mui/material'
import React from 'react'
import AllUserTabs from '../components/Messages/AllUserTabs'
import MessageContainer from '../components/Messages/MessageContainer'
import "./Messages.css"
import '../actions/chat'
import { postMessage, getAllMessages, startNewChat } from '../actions/chat'
import { useLocation } from 'react-router-dom'

const defaultEmptyMsgUser = "(Wow very empty!)"
//const location = useLocation();

class Messages extends React.Component {
    //getting the messages to put in our state requires server calls
    state = {
        currentTab: 0,
        containsDefaultMessage: true,
        users: [
            {
                name: defaultEmptyMsgUser,
                profilePic: "https://i.redd.it/x7nxdaef5eg21.jpg",
                textfieldValue: "",
                messages: [
                    {
                        isOutgoing: false,
                        timestamp: "",
                        contents: "Send your very first message today!"
                    }
                ]
            }/*,
            {
                name: "sadbobby6", 
                profilePic: null, 
                textfieldValue: "",
                messages:[
                    {
                        isOutgoing: true,
                        timestamp: "Mar 04 2022 9:35:24 AM",
                        contents: "Hi!"
                    },
                    {
                        isOutgoing: false,
                        timestamp: "Mar 04 2022 10:37:25 AM",
                        contents: "Hi! I saw your trade offer, can I get it for free by any chance?"
                    }
                ]
            }, 
            {
                name: "Gordon", 
                profilePic: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Gordon_Ramsay_colour_Allan_Warren.jpg/240px-Gordon_Ramsay_colour_Allan_Warren.jpg",
                textfieldValue: "",
                messages: [
                    {
                        isOutgoing: false,
                        timestamp: "Mar 03 2022 9:35:24 AM",
                        contents: "what are you?"
                    },
                    {
                        isOutgoing: true,
                        timestamp: "Mar 03 2022 9:40:24 AM",
                        contents: "an idiot sandwhich!"
                    }
                ]
            },
            {
                name: "Karen",
                profilePic: "https://i.kym-cdn.com/entries/icons/mobile/000/027/963/karenimg.jpg",
                textfieldValue: "",
                messages: [
                    {
                        isOutgoing: false,
                        timestamp: "Mar 02 2022 9:40:24 AM",
                        contents: "I want to speak to the manager!"
                    }
                ]

            }*/
        ]
    }

    componentDidMount(){
        this._onStart();
    }

    componentDidUpdate(prevProps){
        if (prevProps.data !== this.props.data) {
            this._onPropsChange();
        }
        this._onStateChange();
    }

    _onPropsChange() {

    }

    _onStart(){
        //handle the following cases:
        //1: no messages
        //2: user came to this page using "message trader" button
        //2.1: they already have an existing chat with them
        //2.2: new chat with them
        //3: not linked, has messages
        
        //TODO: INCOMPLETE

        console.log("printing props")
        console.log(this.props)
        const newUser = this.props.data.newUser;

        if (newUser){
            
            //const newUser = location.newUser;
            if (newUser.length > 0){
                startNewChat(newUser, () => getAllMessages(this))

                //setTimeout(() => {
                //    getAllMessages(this);
                //}, 0);
            }
            
        } else {
            getAllMessages(this);
        }
        
    }

    _onStateChange(){
        if (this.state.containsDefaultMessage && this.state.users.length > 1)
            this.setState({
                containsDefaultMessage: false,
                users: this.state.users.filter(function(user) { 
                return user.name !== defaultEmptyMsgUser;
            })});
    }

    /*
    //assumes users is an array of users
    _initState(users=null){
        if (!users){
            this.setState({
                currentTab: 0,
                users: [
                    {
                        name: "<N/A>",
                        textfieldValue: "",
                        messages: []
                    }
                ]
            });
        } else {
            this.setState({
                currentTab: 0,
                users: users
            });
        }
    }*/

    //componentWillUnmount(){
    //    this.props.callback({})
    //}

    createUser(name, profilePic=null, messages=[]){
        const newUser = {
            name: name,
            profilePic: profilePic,
            textfieldValue: '',
            messages: messages
        }
        return newUser;
    }

    _addUser(newUser, appendToFront=true){
        if (appendToFront){
            this.setState(prevState => ({
                users: [newUser, ...prevState.users]
            }));
        } else {
            this.setState(prevState => ({
                users: [...prevState.users, newUser]
            }));
        }
    }

    addUser(name, profilePic=null, messages=[], appendToFront=true){
        this._addUser(this.createUser(name, profilePic, messages), appendToFront);
    }

    removeUser(uid) {//untested
        if (uid < this.state.users.length){
            const usersClone = structuredClone(this.state.users);
            this.setState({
                users: usersClone.splice(uid, 1)
            });
            return true;
        }
        return false;
    }

    removeUsersByName(name) {
        this.setState({users: this.state.users.filter(function(user) { 
            return user.name !== name;
        })});
    }

    _addArrayOfUsers(users, appendToFront=true) {
        //this.setState({
        //    users: [...users, ...this.state.users]
        //})
        if (appendToFront){
            this.setState(prevState => ({
                users: [...users, ...prevState.users]
            }));
        } else {
            this.setState(prevState => ({
                users: [...prevState.users, ...users]
            }));
        }
        

        return users.length;
    }

    findUserByName(name) {//untested
        const compName = name.toLowerCase().trim();
        //for (let i=0; i<this.state.users.length; i++){
        //    console.log(i)
        //    const user = this.state.users[i];
        //    if (user.name.toLowerCase().trim() === compName){
        //        return i;
        //    }
        //}
        //return -1;
        const allNames =  this.state.users.map(function(user) {return user.name.toLowerCase().trim(); })
        console.log(allNames)
        return allNames.indexOf(compName);
    }

    _changeIndexOfUser(oldIdx, newIdx){//unused currently
        if (oldIdx == newIdx){
            return;
        }
        let usersCpy = this.state.users.slice();
        const tempUser = usersCpy[newIdx];
        usersCpy[newIdx] = usersCpy[oldIdx];
        usersCpy[oldIdx] = tempUser;
        this.setState({
            currentTab: this.state.currentTab,
            users: usersCpy
        });
    }

    _bringUserToFront(uid){
        if (uid == 0){
            return;
        }
        let usersCpy = this.state.users.slice();
        const tempUser = usersCpy[uid];
        usersCpy.splice(uid, 1);
        usersCpy.unshift(tempUser);
        this.setState({
            currentTab: this.state.currentTab,
            users: usersCpy
        });
    }

    _changeTab = (newTabIdx) => {
        this.setState({
            currentTab: newTabIdx
        })
    }

    changeTextfieldValue(uid, text){
        //copy every other part of the state and add our changed item
        let newUsers = this.state.users.slice();
        newUsers[uid].textfieldValue = text;
        this.setState({
            users: newUsers
        });
    }

    _onChangeTextfield(){
        const text = document.getElementById("textTypingField").value;
        const uid = this.state.currentTab;
        
        this.changeTextfieldValue(uid, text);
    }

    sendMessage(deliverMessage, uid, sentMessageSuccessfully=true){
        //requires a server call to send messages
        if (deliverMessage.length == 0) {
            return;
        }

        //send request to server to send message
        //const sentMessageSuccessfully = postMessage(deliverMessage, this.state.users[uid].name);
        
        //timestamp data
        const currDate = new Date();
        const dateStr = currDate.toDateString() + " " + currDate.toLocaleTimeString();
        
        //copy messages from state and append new message
        let newMessages = this.state.users[uid].messages.slice();
        if (sentMessageSuccessfully){
            newMessages.push(
                {
                    isOutgoing: true,
                    timestamp: dateStr,
                    contents: deliverMessage
                    
                }
            );
        } else {
            newMessages.push(
                {
                    isOutgoing: true,
                    timestamp: dateStr,
                    contents: "<ERROR: FAILED TO SEND MESSAGE>"
                }
            );
        }
        
        //copy every other part of the state and add our changed item
        let newUsers = this.state.users.slice();
        newUsers[uid].messages = newMessages;
        this.setState({
            users: newUsers
        });

        //clear textfield
        this.changeTextfieldValue(uid, "");

        //move user to top of tabs
        this._bringUserToFront(uid);
        this._changeTab(0);
    }
    
    _sendMessage = (uid) => {
        const inputBox = document.getElementById("textTypingField");
        const deliverMessage = inputBox.value;
        postMessage(deliverMessage, this.state.users[uid].name, this, uid);//send request to server
        //this.sendMessage(deliverMessage, uid);
    }

    _sendMessageByEnterKey = (event, uid) => {
        if (event.key === 'Enter'){
            this._sendMessage(uid);
        }
    }

    render() {
        const userIdx = this.state.currentTab;
        const defaultTypingBoxContent = "Send a message to " + this.state.users[userIdx].name;
        return (
            <div id="messageSection">
                <div className='leftContainer'>
                    <AllUserTabs 
                        users={this.state.users}
                        changeTab={this._changeTab}
                        currentTab={this.state.currentTab}
                    />
                </div>
                <div className='rightContainer'>
                    <MessageContainer 
                        name={this.state.users[userIdx].name}
                        messages={this.state.users[userIdx].messages}
                    />
                    <div className='bottomBar'>
                        <div className='typingField'>
                            <TextField
                                fullWidth
                                label={defaultTypingBoxContent}
                                value={this.state.users[userIdx].textfieldValue}
                                variant="outlined"
                                size="small"
                                id='textTypingField'
                                onKeyPress={(event) => this._sendMessageByEnterKey(event, userIdx)}
                                onChange={() => this._onChangeTextfield()}
                            />
                        </div>
                        <div className='buttonArea'>
                            <Button 
                                id='sendButton' 
                                onClick={() => this._sendMessage(userIdx)} 
                                variant="contained" 
                                size="large"
                            >
                                Send
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
}

export default Messages;