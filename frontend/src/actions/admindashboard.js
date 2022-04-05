import { SERVER_URL } from "../env";

export const createAdmin = (firstName, lastName, email, userName, password, successCallback=null, failCallback=null) => {
    // the URL for the request
    const url = `${SERVER_URL}users`;

    // The data we are going to send in our request
    const user = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        userName: userName,
        password: password,
        isAdmin: true
    }

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "post",
        body: JSON.stringify(user),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    // Send the request with fetch()
    fetch(request)
        .then(function (res) {
            console.log(res)
            if (successCallback && res.status === 200) {
                successCallback();
                //return true;
                return true;
            } else if (failCallback){
                failCallback();
                return false;
            }
        })
        .catch(error => {
            console.log(error);
            if (failCallback){
                failCallback();
                return false;
            }
        });
};

export const deleteUser = (userName, successCallback=null, failCallback=null) => {
    // the URL for the request
    const url = `${SERVER_URL}users`;

    // The data we are going to send in our request
    const user = {
        username: userName,
    }

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "delete",
        body: JSON.stringify(user),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    // Send the request with fetch()
    fetch(request)
        .then(function (res) {
            console.log(res)
            if (successCallback && res.status === 200) {
                successCallback();
                //return true;
                return true;
            } else if (failCallback){
                failCallback();
                return false;
            }
        })
        .catch(error => {
            console.log(error);
            if (failCallback){
                failCallback();
                return false;
            }
        });
};