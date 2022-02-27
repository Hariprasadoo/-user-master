
# user-api-master

The user API module allows registering, logging in, forgetting the password, 
email sign up verification, and different validation. The code is completely 
written in APIs of Node. js library which is asynchronous, that is, 
non-blocking, Very Fast − built on Google Chrome's V8 JavaScript Engine. 
Nodejs help developers design various apps with cross-platform support. 
That's why I love Nodejs.


You are not allowed commercial use of this code whenever you are 
permitted to use it for an educational purpose only to understand 
how system engineering works.

There are some security implementations applied whenever lots of 
industry-standard have to be implemented. 
## Deployment

To deploy this project run

```bash
  npm install
```

To run this project run
```bash
  node app.js
```

Before starting the programme be sure all the environment variable is set in your .env file
# Following steps are the Usage/Examples using Postman



## http://localhost:3000/user/signup

```javascript
{
"fullname": "Hari Prasad Dahal",
"email": "dahal.harry1@gmail.com",
"username": "hariprasadoo",
"password": "ValidPassword@79",
"passwordagain": "ValidPassword@79"
}
```
## http://localhost:3000/user/signin

```javascript
{
"email": "dahal.harry1@gmail.com",
"password": "ValidPassword@79"
}
```
## http://localhost:3000/user/update

You should use Bearer Token to get authenticated to use the update route.
```javascript
{
"fullname": "Hari Prasad Dahal",
"email": "dahal.harry1@gmail.com",
"username": "hariprasadoo",
"oldpassword":"ValidOldPassword@79",
"password":"ValidPassword@79",
"passwordagain":"ValidPassword@79",
"phone":"985-117-9323",
"dob": "1995-09-24T04:15:00.000Z",
"pob":"Kathmandu",
"cob":"Nepal"
}
```
## http://localhost:3000/user/forgetpass

```javascript
{
"email": "dahal.harry1@gmail.com",
"password":"ValidPassword@79",
"passwordagain":"ValidPassword@79"
}
```

Below code is to test Relational database entry inside asrtologer table.

## http://localhost:3000/user/astrologer

```javascript
{
"email": "dahal.harry1@gmail.com",
"abbreviation": "Sir",
"university": "TU",
"los": "BSc",
"sector": "Physics"
}
```
## http://localhost:3000/user/update-astrologer

```javascript
{
"email": "dahal.harry1@gmail.com",
"abbreviation": "SirUp",
"university": "TU_Up",
"los": "BScUp",
"sector": "PhysicsUp"
}
```

## License

[MIT](https://choosealicense.com/licenses/mit/)

