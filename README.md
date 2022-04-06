# team30
## About
This web app was created with the purpose of allowing users to to trade items with each other rather than outright selling items for money. Users can post about an item they want to trade away, and other users can make bids on that item.

## Technologies Used
  - MongoDB
  - Express.js
  - React.js
  - Node.js
  - Google Maps API
  - Cloudinary SDK

## Local Setup
Using these running instructions is ideal for viewing our webpages with posts, messages, etc.
```
git clone https://github.com/csc309-winter-2022/team30.git
cd team30
git checkout dev
npm run setup
npm run startall
```
## Local Setup with Local MongoDB instance
Replace the connection string in server.js with mongodb://0.0.0.0:27017/Tradeverse
```
git clone https://github.com/csc309-winter-2022/team30.git
cd team30
npm run setup
mkdir mongo-data
mongod --dbpath mongo-data
npm run startall
```
The app should start locally on port 3001. Open http://localhost:3001 to view it.

## Deployed link
https://tradeverse30.herokuapp.comTODO

## Web API Endpoint Documentation
Note: REACT_APP_API_URL is an env variable that had the value http://localhost:3001/api/ (the root url for all of our APIs)

#### Chat.js (Messaging API)
 - `/chat`
  - GET all chats involving the currently logged in user
  - Request body: Username of user currently logged in
  - Request params: None
  - Response: HTTP 200 and an object containing all chats involving current user, 400 or 500 otherwise
- `/chat`
  - POST a new message to the db
  - Request session: userName (username of user sending message)
  - Request body: recipient (recipient username), messageContents
  - Request params: None
  - Response: HTTP 200 and the message object if successful, 400 or 500 otherwise
- `/chat/u/:otherUsername`
  - GET all chats involving the current logged on user and another user
  - Request session: userName
  - Request body: None
  - Request params: otherUsername (username of receiving user)
  - Response: HTTP 200 and an object containing the chats between the 2 users, 400 or 500 otherwise
- `/chat/recent`
  - GET last message for each chat for logged in user (for chat message preview tabs)
  - Request session: userName
  - Request body: None
  - Request params: None
  - Response: HTTP 200 and the lastest message from each chat from the user in JSON form, 400 or 500 otherwise
- `/chat`
  - DELETE all chats involving a certain user (logged in version, for deleting your own account)
  - Request session: userName
  - Request body: None
  - Request params: None
  - Response: HTTP 200 and all chats involving the currently logged in user in JSON form, 400 or 500 otherwise
- `/chat/u/:username`
  - DELETE all chats involving a certain user (admin version, for deleting other accounts)
  - Request session: isAdmin (boolean to check if current user is admin)
  - Request body: None
  - Request params: username (the user for which chats are to be deleted)
  - Response: HTTP 200 and all chats involving the currently logged in user in JSON form, 400 or 500 otherwise
- `/chat/all`
  - GET all chats
  - Request session: None
  - Request body: None
  - Request params: None
  - Response: HTTP 200 and an object containing all the chats for all users, HTTP 400 or 500 otherwise

#### GoogleMaps.js (Google Maps Component API)
- `/listingcoords/`
  - POST an address to the Google Maps API and retrieve the coordinates
  - Request body: An address (that exists)
  - Request params: None
  - Response: HTTP 200 and the full formatted address, latitude, and longitude of the address in the request body. HTTP 400 otherwise.

#### Offer.js (Trade Offer/Bid API)
- `/offer`
  - POST a new offer on a posted item to the db
  - Request body: title (the post title), user (the username of the user making the offer), img (image link of offer), imgId (the id of the image in Cloudinary), description, postId (document id of the post on which the offer is being made on), tradeWith (the username of the user who posted the item on which the offer is being made), tradePostTitle (the title of the post on which the offer is being made)
  - Request params: None
  - Response: HTTP 200 and the new post if successful, 500 or 400 otherwise
- `/offer`
  - GET all offers made for all posts
  - Request body: None
  - Request params: None
  - Response: HTTP 200 and an object containing all offers, 500 otherwise
- `/offer/useroffers`
  - GET all offers made by a specific user
  - Request body: user (a username of an existing user)
  - Request params: None
  - Response: HTTP 200 and an object containing all offers made by the user if successful, 500 otherwise
- `/offer/:id`
  - GET offers made for a specific post
  - Request body: None
  - Request params: The id of the post
  - Response: HTTP 200 and an object containing all offers made for a post if successful, 404 or 400 otherwise
- `/offer/:id`
  - DELETE an offer by id
  - Request body: None
  - Request params: The document id of the offer
  - Response: Send the deleted offer and HTTP 200 if successfully deleted, 404 or 500 otherwise

#### Post.js (Post API)
 - `/post`
  - POST a new post to the database.
  - Request body: userName (name of user of making post), postName (title of post), postDescription, postImg (url of image in Cloudinary), postImgId (id of image in Cloudinary in order to allow for deletion of image later), likes (number of likes; set to 0 initially), dislikes, listingAddress (the address at which the trade will be conducted)
  - Request params: None
  - Response: HTTP 200 if successful, 400 if Bad Request, 500 if Internal Server Error
- `/post/allposts`
  - GET all the posts made by all users from the database
  - Request body: None  
  - Request params: None
  - Response: An object containing all the trade post documents from the db
- `/post/updatelikes`
  - PATCH the number of likes a post has
  - Request body: The id of the post that will have the number of likes updated
  - Request params: None
  - Response: The post with updated likes and status 200 if successful. Status 500 otherwise.
- `/post/updatedislikes`
  - PATCH the number of dislikes a post has
  - Same specifications as `/updatelikes` but the number of dislikes to updated in the db
- `/post/:id`
  - GET a post with a specific document id
  - Request body: None
  - Request params: post id
  - Response: A single post object and status 200 if successful, 404 or 500 otherwise
- `/post/byUser/:username`
  - GET all posts made by a specific user
  - Request body: None
  - Request params: The username of the user whos posts need to be retrieved
  - Response: An object containing all the posts made by the user and status 200 if successful, 400 or 500 otherwise
- `/post/:id`
  - PATCH the post in order to update existing posts
  - Request body: one of more of the following fields: postName, postImg, postImgId, postDescription, listingAddress
  - Request params: the id of the post being updated
  - Response: The updated post object and status 200 if successful, 404 or 500 otherwise
- `/post/:id`
  - DELETE a post
  - Request body: None
  - Request params: the id of the post to delete
  - Response: The deleted post and status 200 if successful, 404 or 500 otherwise

#### Report.js (Reports API)
- `/report`
  - POST a new report to the db
  - Request body: title (report title), user (user making the report), reportType, postId (id of the post being reported)
  - Request params: None
  - Response: The report object and HTTP 200 if successful, 400 or 500 otherwise
- `/report`
  - GET all reports made by all users
  - Request body: None
  - Request params: None
  - Repsonse: HTTP 200 and an object containing all the report documents if successful, 500 otherwise
- `/report/:id`
  - DELETE a report
  - Request body: None
  - Request params: id (the report id)
  - Response: HTTP 200 and the deleted report document if successful, 404 or 500 otherwise
- `/report/:id`
  - DELETE all reports made for the same post
  - Request body: None
  - Request params: id (the post id)
  - Response: HTTP 200 and the deleted reports if successful, 404 or 500 otherwise
- `/reports`
  - GET all the posts listed in the report pages
  - Request body: None
  - Request params: None
  - Response: HTTP 200 and all the posts listed in the reports pages, 500 otherwise

#### Upload.js (Cloudinary Image Upload API)
- `/upload/image`
  - POST an image to Cloudinary image bucket
  - Request body: files (object containg files uploaded locally)
  - Request params: None
  - Response: HTTP 200 and the Cloudinary image url and id, 500 otherwise
- `/upload/image/:imageId`
  - DELETE an image in image bucket by id
  - Request body: None
  - Request params: imageId (the id of the image)
  - Response: HTTP 200 if successful, 500 otherwise

#### User.js (User API)
- `/users/`
  - POST a new user to the db
  - Request body: userName, password, isAdmin (only for logged in admin users to create new admins, will ignore otherwise)
  - Request params: None
  - Response: HTTP 200 and user document object if successful, 400 or 500 with error information otherwise
- `/users/`
  - DELETE user in the db (and all the chats they are involved in)
  - Request body: userName
  - Request params: None
  - Response: HTTP 200 and deleted user document object and deleted chats if successful, 403 if admin is not logged on, 400 or 500 with error information otherwise
- `/users/getbyusername`
  - GET a users information using their username
  - Request body: userName
  - Request params: None
  - Response: HTTP 200 and the user document for this user if successful, 500 otherwise
- `/users/logout`
  - GET the current session token and delete it
  - Request body: None
  - Request params: None
  - Response: HTTP 200 and object indicating success if successful, 500 toherwise
- `/users/check-session`
  - GET the session token of the currently logged in user
  - Response: userID, userName, and admin status of current user and HTTP 200 if succesful, 404 otherwise
- `/users/login`
  - POST the login request to the server
  - Request body: userName, password
  - Request params: None
  - Response: HTTP 200 if login successful, 500 otherwise
- `/users/allusers`
  - GET all users
  - Request body: None
  - Request params: None
  - Response: HTTP 200 and the user documents of all users if successful, 500 otherwise
- `/users/:id`
  - GET a specific user by document id
  - Request body: None
  - Request params: id (user document id)
  - Response: HTTP 200 and the user document if successful, 500 otherwise
- `/users/:id`
  - PATCH information of a specific users
  - Request body: one or more of email, firstName, lastName, avatarImg, avatarId, password
  - Request params: id (user document id)
  - Response: HTTP 200 and updated user document, 404 or 500 otherwise
