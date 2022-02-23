# Authenticator app

This app is used for authenticating any SPA. This is built on **NodeJS**.

- The user needs to register first before logging-in.
- Once the registration is complete, the user can then use the same credentials to login.
- Upon login, the login endpoint returns with access token and refresh token.
- Access token has a life time of 60 minutes.
- Refresh token has a life time of 7 days.
- User can extend the access token by using refresh token endpoint as long as refresh token in valid.
- Once the refresh token also expires, user has to login again to gain access.

## Endpoints list

1. **Register a User** - POST `/register`

```
  {
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@email.com",
    "password": "password",
    "role": "(optional)"
  }
```

2. **Update a User** - PUT `/update`

```
  {
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@email.com",
    "role": "(optional)"
  }
```

3. **Change/Update Password** - PUT `/update-password`

```
  {
    "email": "john.doe@email.com",
    "oldPassword": "password",
    "newPassword": "password1"
  }
```

4. **Remove a User** - DELETE `/remove/<email_address>`

5. **Get All Users** - GET `/users`

6. **Get Single User** - GET `/user/<email_address>`

7. **Login** - POST `/login`

```
  {
    "email": "john.doe@email.com",
    "password": "password"
  }
```

8. **Logout** - GET `/logout`

```
  <request header>
  {
    "accessToken": "eypq......"
  }
```

9. **Refresh Token** - GET `/refreshToken`

```
  <request header>
  {
    "refreshToken": "eypq......"
  }
```

## Environment Variables to configure

Configure the application by updating the below environment variables

```
  NODE_ENV=development #development for local environment
  PORT=4000 #port on which application runs
  ADMINS=john.doe@email.com #currently unused
  TOKEN_SECRET=abc #secret-key to generate access token
  TOKEN_EXPIRES_IN=3600000 #access token lifetime in milli seconds
  REFRESH_SECRET=xyz #secret-key to generate refresh token
  REFRESH_EXPIRES_IN=604800000 #refresh token lifetime in milli seconds
  MONGODB_HOST=localhost #MongoDB host
  MONGODB_PORT=27017 #MongoDB port
  MONGODB_USERNAME=username #MongoDB username
  MONGODB_PASSWORD=password #MongoDB password
  MONGODB_DATABASE=Authenticator #MongoDB database name
```
