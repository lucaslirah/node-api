const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { format, setGlobalDateMasks } = require("fecha");

class MovieNotesController{
    async create(request, response){
        const { title, description, rating, tags } = request.body;
        const { user_id } = request.params;

        console.log("veio");

        response.json();
    }
}

module.exports = MovieNotesController;