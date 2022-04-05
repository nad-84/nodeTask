# Instructions:

- Follow MVC architecture.
- Set global middleware for handling errors.
- Use mongodb (sdk mongoose)
- Use mongodb atlas or docker image of mongodb for locally connection

### Add Validation like:

- Passwords should be 8 characters long, having numbers, characters and atleast one symbol.
- Add a role field in the user model, it should be an enum (ADMIN, USER).
- Passwords should be saved in hash form.
- Email should be valid

### Authentication mechanism:

- authentication by email and password
- Show proper errors message by response, if error exists.
- Use JWT token for authentication.
- JWT token valid for 1 day.

### Functionality:

- Only the admin can view all users.
- Normal users can only view and update the info related to his/her account.
- Normal users can’t create admin accounts.
- Admin users are able to create both accounts for admin and normal users.
- Admin is able to delete ,update, create all types of queries.
- Normal user can search specific user by name like fb
- Provide the forget password and change password functionality, You can use mailtrap, don’t need any other email provider.

# Run Project (how to run project):

we will run this project by running following command in user-app

```
npm install
```

```
npm run dev
```

# ShortDescription Of Endpoints:

`/users` : on this endpoint admin can create new admin or user <br />
`/users/login`: login for user/admin role <br />
`/users/logout`: logout that user who is loggedIn <br />
`/admins/me`: Admiin Reading all profiles<br />
`.get(/users/me)`: user Reading his/her profile <br />
`.patch(/users:id)`: update the user <br />
`.delete(/users/me)`: delete the login user profile <br />
`/users/:name`: Searching any user by his/her name<br />

`/works(POST)`: Create work through post req <br />
`/works(GET)`: Reading that work through **get** <br />
`works/:id`: update that work by patch <br />
`works/:id`: deleting the specific work by id <br />

`/projects`: Create project through post req <br />
`/projects`: Reading that project through get <br />
`projects/:id`: update that project by patch <br />
`projects/:id`: deleting the specific project by id <br />

`/abouts`: Create about through post req <br />
`/abouts`: Reading that about through get <br />
`abouts/:id`: update that about by patch <br />
`abouts/:id`: deleting the specific about by id<br />

`/skills`: Create skill through post req<br />
`/skills`: Reading that skill through get<br />
`skills/:id`: update that skill by patch <br />
`skills/:id`: deleting the specific skill by id<br />

`/contacts`: Create contact through post req<br />
`/contacts`: Reading that contact through get<br />
`contacts/:id`: update that contact by patch <br />
`contacts/:id`: deleting the specific contact by id<br />
