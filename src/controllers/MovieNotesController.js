const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const { format, setGlobalDateMasks } = require("fecha");

class MovieNotesController{
    async create(request, response){
        const { title, description, rating, tags } = request.body;
        const { user_id } = request.params;

        if(!title){
            throw new AppError("You must at least give the note a title!");
        }

        const [movieNoteId] = await knex("movie_notes").insert({
            title,
            description,
            rating,
            user_id
        });

        const movieTags = tags.map(genre => {
            return {
                note_id: movieNoteId,
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
    async delete(request, response){
        const { id } = request.params;

        await knex("movie_notes")
        .where({id}).delete();

        return response.json();
    }
    async index(request, response){
        const { user_id, title, tags } = request.query;
        
        let movieNotes;

        if(tags){
            const filterTags = tags.split(',').map(tag => tag.trim());
            
            movieNotes = await knex("movie_tags")
            .select([
                "movie_notes.id",
                "movie_notes.title",
                "movie_notes.description",
                "movie_notes.rating",
                "movie_notes.user_id",
            ])
            .where("movie_notes.user_id", user_id)
            .whereLike('movie_notes.title', `%${title}%`)
            .whereIn("genre", filterTags)
            .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id" )
            .orderBy("movie_notes.title");
        }else{
            movieNotes = await knex("movie_notes")
            .where({user_id})
            .whereLike('title', `%${title}%`)
            .orderBy("title");
        }

        const userMoviesTags = await knex("movie_tags").where({user_id});

        const movieNotesWithTags = movieNotes.map(movieNote => {
            const movieNoteTags = userMoviesTags.filter(tag => tag.note_id === movieNote.id);

            return{
                ...movieNote,
                tags: movieNoteTags
            }
        });

        return response.json(movieNotesWithTags);
    }
}

module.exports = MovieNotesController;