const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class UsersController{
    async create(request, response){
        const { name, email, password } = request.body;
        
        const users = await knex("users").where({ email });
        console.log(email);
        
        if(users){
            throw new AppError("Email already in use!");
        }
        
        return response.json(users);
    }
}

module.exports = UsersController;