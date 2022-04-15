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

`/users` : Admin can create new admin or user <br />
`/users/login`: Login for user/admin role <br />
`/logout`: Logout that user who is loggedIn <br />
`/admins/allProfile`: Admiin reading all profiles <br />
`/users/me`: User reading his/her profile <br />
`/users/update_me`: Update the user <br />
`/users/password`: Updating the password <br />
`/users/delete_me`: Delete the login user profile <br />
`/admin/delete/:_id`: Admin deleting any specific user <br />
`/users/:name`: Searching any user by his/her name <br />
`/forgotPassword`: Any user forgot the password <br />
`/resetPassword`: Any user reseting the password after forgot <br />

`/abouts`: Create about through post req <br />
`/abouts`: Reading that about through get <br />
`/abouts/:id`: update that about by patch <br />
`/abouts/:id`: deleting the specific about by id<br />
`/admin/allAbouts`: Admin reading all the abouts <br />

`/contacts`: Create contact through post req <br />
`/contacts`: Reading that contact through get <br />
`/contacts/:id`: Update that contact by patch <br />
`/contacts/:id`: Deleting the specific contact by id <br />
`/admin/allContacts`: Admin reading all the contacts<br />

`/projects`: Create project through post req <br />
`/projects`: Reading that project through get <br />
`/projects/:id`: Update that project by patch <br />
`/projects/:id`: Deleting the specific project by id <br />
`/admin/allProjects`: Admin reading all the projects <br />

`/skills`: Create skill through post req<br />
`/skills`: Reading that skill through get<br />
`/skills/:id`: Update that skill by patch <br />
`/skills/:id`: Deleting the specific skill by id<br />
`/admin/allSkills`: Admin reading all the skills<br />

`/works (POST)`: Create work through post req <br />
`/works (GET)`: Reading that work through <br />
`/works/:id`: Update that work by patch <br />
`/works/:id`: Deleting the specific work by id <br />
`/admin/allWorks`: Admin reading all the works <br />
