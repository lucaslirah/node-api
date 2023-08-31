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
        
        const [userExists] = knex("users").where({email});
        console.log(userExists);

        // if (userExists && userExists.id !== user.id) {
        //     throw new AppError('Email já cadastrado');
        // }

        // // if( && .id !== user.id){
        // //     throw new AppError("Email already in use!");
        // // }
        
        // user.name = name ?? user.name;
        // user.email = email ?? user.email;

        // if(password && !old_password){
        //     throw new AppError("You need to enter the old password.");
        // }
        // if(password && old_password){
        //     const checkOldPassword = await compare(old_password, user.password);
        //     if(!checkOldPassword){
        //         throw new AppError("The old password does not mach.");
        //     }

        //     user.password = await hash(password,8);
        // }
        
        // setGlobalDateMasks({
        //     dateTimeMask: 'YYYY-MM-DD HH:mm:ss'
        // });
        // const timestamp = format(Date.now(), 'dateTimeMask');

        // // await knex("users")
        // // .where({id})
        // // .update({
        // //     name: user.name,
        // //     email: user.email,
        // //     password: user.password,
        // //     updated_at: timestamp,
        // // })

        response.json();
    }
}

module.exports = UsersController;