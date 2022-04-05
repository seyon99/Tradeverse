import React from "react";
import { Grid, Paper, TextField, Button } from "@mui/material";
import './AdminDashboard.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { createAdmin, deleteUser } from '../actions/admindashboard'

class AdminDashboard extends React.Component {
    state = {
        feedbackText: "",
        errorStatus: false
    }
    _setFeedbackText(str, isError=false) {
        this.setState({
            feedbackText: str,
            errorStatus: isError
        })
    }
    _handleFeedbackTextDisplay(){
        if (this.state.feedbackText === ""){
            return (<span></span>);
        }
        let c = "feedbackTextValid"
        if (this.state.errorStatus){
            c = "feedbackTextError";
        }
        return (
            <span id='feedbackText' className={c}>
                {this.state.feedbackText}
            </span>
        );
    }
    deletePost(url){
        //requires server call
        let str = "This post does not exist!";
        let err = true;
        if (url === 'tradeverse.com/post/1'){
            str = "Post was removed."
            err = false;
        } else if (url=== ""){
            str = "Post URL field was left empty!"
        }
        this._setFeedbackText(str, err);
    }
    _deletePost(){
        const url = document.getElementById("deletePostUrl").value;
        this.deletePost(url);
    }
    deleteUser(username){
        //requires server call
        let str = "Successfully deleted user!";
        let err = false;
        if (username === ""){
            str = "Username field was left empty!"
            err = true;
        }
        if (err){
            this._setFeedbackText(str, err);
            return;
        }
        const result = deleteUser(username, () => {this._setFeedbackText("Successfully deleted user!", false)}, () => {this._setFeedbackText("Failed to delete user (does not exist or is admin user)", true)})
        console.log("logging result")
        console.log(result)
        //if (!result) {
        //    err = true
        //    str = "Failed to delete user (does not exist or is admin user)"
        //}
        //this._setFeedbackText(str, err);
    }
    _deleteUser(){
        const username = document.getElementById("deleteUsername").value;
        this.deleteUser(username);
    }
    _validateEmail(email) {
        const re = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);///  /\S+@\S+\.\S+/;
        return re.test(email);
    }
    createAdmin(firstname, lastname, email, username, password){

        let str = "Created admin user.";
        let err = false;
        if (firstname === "" || lastname === "" || email === "" || username === "" || password == ""){
            str = "A field was left empty!"
            err = true;
        } else if (!this._validateEmail(email)){
            str = "Invalid email!"
            err = true;
        }
        if (err){
            this._setFeedbackText(str, err);
            return;
        }

        const result = createAdmin(firstname, lastname, email, username, password, () => {this._setFeedbackText("Created admin user.", false)}, () => {this._setFeedbackText("Failed to create admin user (internal server problem or username is already taken)", true)})
        console.log(result)
        //if (!result) {
        //    err = true
        //    str = "Failed to create admin user (internal server problem or username is already taken)"
        //}
        //this._setFeedbackText(str, err);
    }
    _createAdmin(){
        const firstname = document.getElementById("createFirstName").value;
        const lastname = document.getElementById("createLastName").value;
        const email = document.getElementById("createEmail").value;
        const username = document.getElementById("createUsername").value;
        const password = document.getElementById("createPassword").value;
        this.createAdmin(firstname, lastname, email, username, password);
    }
    render() {
        return (
            <>
            <div className="title">
                    <h4>Admin Dashboard</h4>
            </div>
            <div id='dashboardContainer'>
                <div className="cardit">
                    <br/>
                    <h4 className="subt">Delete Users</h4><br/>
                    <TextField id='deleteUsername' label="Username" variant="outlined" className="textl" required/><br/><br/>
                    <Button 
                    id='deleteUser' 
                    variant="contained"
                    onClick={() => this._deleteUser()}
                    >   
                        Delete User
                    </Button>
                    <br/><br/>
                </div>     
                        
                <div className="cardit">
                    <br/>
                    <h4 className="subt">Create Admin</h4><br/>
                    <TextField id='createFirstName' label="First Name" variant="outlined" className="textl" required/><br/><br/>
                    <TextField id='createLastName' label="Last Name" variant="outlined" className="textl" required/><br/><br/>
                    <TextField id='createEmail' label="Email" variant="outlined" className="textl" required/><br/><br/>
                    <TextField id='createUsername' label="Username" variant="outlined" className="textl" required/><br/><br/>
                    <TextField id='createPassword' label="Password" variant="outlined" className="textl" required/><br/><br/>
                    <Button 
                        id='createUser' 
                        variant="contained"
                        onClick={() => this._createAdmin()}
                    >
                        Create Admin
                    </Button>
                    <br/><br/>
                </div>     
                        
                    {/* <Grid item xs={6}>
                        <div>
                            <Paper id='removePosts'  sx={{p: 1}} justifyContent="center">
                                <div className='paperContents smallBox'>
                                    <h4>Remove Posts</h4><br/>
                                    <TextField id='deletePostUrl' label="URL of post" variant="outlined" /><br/><br/>
                                    <Button 
                                        id='deletePost' 
                                        variant="contained"
                                        onClick={() => this._deletePost()}
                                    >
                                        Delete Post
                                    </Button>
                                </div>
                            </Paper>
                            <Paper sx={{p: 1}} >
                            <div className='paperContents smallBox'>
                                <h4>Delete Users</h4><br/>
                                <TextField id='deleteUsername' label="Username" variant="outlined" /><br/><br/>
                                <Button 
                                    id='deleteUser' 
                                    variant="contained"
                                    onClick={() => this._deleteUser()}
                                >   
                                    Delete User
                                </Button>
                            </div>
                            </Paper>
                        </div>
                        
                    </Grid>
                    <Grid item xs={6}>
                        <Paper sx={{p: 1}} >
                            <div className='paperContents'>
                                <h4>Create Admin</h4><br/>
                                <TextField id='createFullName' label="Full Name" variant="outlined" /><br/><br/>
                                <TextField id='createEmail' label="Email" variant="outlined" /><br/><br/>
                                <TextField id='createUsername' label="Username" variant="outlined" /><br/><br/>
                                <TextField id='createPassword' label="Password" variant="outlined" /><br/><br/>
                                <Button 
                                    id='createUser' 
                                    variant="contained"
                                    onClick={() => this._createAdmin()}
                                >
                                    Create Admin
                                </Button>
                            </div>
                        </Paper>
                    </Grid> */}
                
                <div id='feedbackTextContainer'>
                    {this._handleFeedbackTextDisplay()}
                </div>
            </div>
            </>
            
        );
    }
}

export default AdminDashboard;