const { z } = require('zod');

const validateCreateMovie = (data) => {
    const schema = z.object({
        title: z.string(),
        description: z.string(),
        releaseYear: z.string(),
        director: z.string().optional(),
        poster: z.string().optional(),
        languages: z.array(z.string()),
        cast: z.array(z.string()),
        genre: z.array(z.string()),
        runtime: z.string(),
        rating: z.string(),
        imdbRating: z.string(),
    });
    return schema.safeParse(data)
}

module.exports = {
    validateCreateMovie,
}