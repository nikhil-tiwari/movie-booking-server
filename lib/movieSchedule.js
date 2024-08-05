const { z } = require('zod');

const validateMovieScheduleSchema = (data) => {
    const schema = z.object({
        movieID: z.string(),
        theatreID: z.string(),
        startTime: z.coerce.date(),
        pricing: z.number(),
        language: z.string(),
    });
    return schema.safeParse(data)
}

module.exports = {
    validateMovieScheduleSchema,
};