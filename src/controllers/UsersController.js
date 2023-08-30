const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { hash, compare } = require("bcryptjs");

class UsersController{
    async create(request, response){
        const { name, email, password } = request.body;
        
        const usersEmails = await knex("users")
        .select("email")
        .where({email});

        function userEmail(user){
            return user.email === email;
        }

        const emailExists = usersEmails.find(userEmail);

        if(emailExists){
            throw new AppError("Email already in use!");
        }

        const hashedPassword = await hash(password, 8);
        
        await knex("users").insert({
            name,
            email,
            password: hashedPassword
        });

        return response.status(201).json();
    }
}

module.exports = UsersController;