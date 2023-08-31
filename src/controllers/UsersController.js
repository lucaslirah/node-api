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
        const { name, email, password, old_password } = request.body;
        const { id } = request.params;

        const [user] = await knex("users")
        .where({id});

        if(!user){
            throw new AppError("User not found!");
        }

        const [userWithUpdatedEmail] = await knex("users").where({email});

        // console.log(userWithUpdatedEmail)
        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
            throw new AppError("Email already in use!");
        }

        // if(user.name === name && user.email === email){
        //     throw new AppError("Data already registered");
        // }

        user.name = name;
        user.email = email;

        setGlobalDateMasks({
            dateTimeMask: 'YYYY-MM-DD HH:mm:ss'
        });
        const timestamp = format(Date.now(), 'dateTimeMask');

        await knex("users")
        .where({id})
        .update({
            name: user.name,
            email: user.email,
            updated_at: timestamp,
        })

        // console.log(timestamp)

        response.json();

    }
}

module.exports = UsersController;