const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { format, setGlobalDateMasks } = require("fecha");

class MovieNotesController{
    async create(request, response){
        const { title, description, rating, tags } = request.body;
        const { user_id } = request.params;
        await knex.raw('PRAGMA foreign_keys = ON');

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
    async show(request, response){
        const { id } = request.params;

        const movieNotes = await knex("movie_notes").where({id}).first();
        const movieTags = await knex("movie_tags").where({note_id: id }).orderBy("genre");

        return response.json({
            ...movieNotes,
            movieTags
        });
    }
}

module.exports = MovieNotesController;