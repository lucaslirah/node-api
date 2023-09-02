const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { hash, compare } = require("bcryptjs");
const { format } = require("fecha");

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

        const [user] = await knex("users").where({id});

        if(!user){
            throw new AppError("User not found!");
        }
        if(email){
            const [userWithUpdatedEmail] = await knex("users").where({email});
            
            if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
                throw new AppError("Email already in use!");
            }
        }
        if(password && !old_password){
            throw new AppError("Old password is required!");
        }
        if(password && old_password){
            const checkOldPassword = await compare(old_password, user.password);

            if(checkOldPassword){
                user.password = await hash(password, 8);
            }else{
                throw new AppError("The old password does not match!");
            }
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        const timestamp = format(Date.now(), 'dateTimeMask')

        await knex("users")
        .where({id})
        .update({
            name: user.name,
            email: user.email,
            password: user.password,
            updated_at: timestamp,
        });

        response.json();
    }
}

module.exports = UsersController;