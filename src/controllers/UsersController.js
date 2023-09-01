const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { hash, compare } = require("bcryptjs");
const { format, setGlobalDateMasks } = require("fecha");

class UsersController{
    async create(request, response){
        const { name, email, password } = request.body;

        const [emailExists] = await knex("users").where({email});

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
    async update(request, response){
        
    }
}

module.exports = UsersController;