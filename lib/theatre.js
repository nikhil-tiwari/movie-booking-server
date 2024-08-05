const { z } = require('zod');

const validateTheatreSchema = (data) => {
    const theatreSchema = z.object({
        name: z.string(),
        location: z.object({
            city: z.string(),
            lat: z.string().optional(),
            long: z.string().optional(),
            address: z.string(),
        })
    });
    return theatreSchema.safeParse(data);
}

module.exports = {
    validateTheatreSchema,
};
