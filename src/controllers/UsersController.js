const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { hash, compare } = require("bcryptjs");

class UsersController{
    async create(request, response){
        const { name, email, password } = request.body;
        
        // const usersEmails = await knex("users")
        // .select("email")
        // .where({email});

        // function userEmail(user){
        //     return user.email === email;
        // }

        // const emailExists = usersEmails.find(userEmail);

        const [emailExists] = await knex("users").where({email});

        if(emailExists){
            throw new AppError("Email already in use!");
        }

        // const hashedPassword = await hash(password, 8);
        
        // await knex("users").insert({
        //     name,
        //     email,
        //     password: hashedPassword
        // });

        return response.status(201).json();
    }
    async update(request, response){
        const { name, email, password, old_password } = request.body;
        const { id } = request.params;

        const [user] = await knex("users")
        .where({id});

        if(!user){
            throw new AppError("User not found!");
        }
        
        response.json();
    }
}

module.exports = UsersController;