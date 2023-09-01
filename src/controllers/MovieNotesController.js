const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { format, setGlobalDateMasks } = require("fecha");

class MovieNotesController{
    async create(request, response){
        const { title, description, rating, tags } = request.body;
        const { user_id } = request.params;

        const [note_id] = await knex("movie_notes").insert({
            title,
            description,
            rating,
            user_id
        });

        const movieTags = tags.map(genre => {
            return {
                note_id,
                user_id,
                genre,
            }
        });

        await knex("movie_tags").insert(movieTags);

        response.json();
    }
}

module.exports = MovieNotesController;