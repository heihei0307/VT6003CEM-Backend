import Joi from "joi";

const add = Joi.object({
    type: Joi.string().required(),
    pet_name: Joi.string().required(),
    age: Joi.number(),
    breed: Joi.string().required(),
    gender: Joi.string().allow(''),
    description: Joi.string().allow(''),
    pet_photos: Joi.array()
})

const update = Joi.object({
    pet_name: Joi.string(),
    age: Joi.number(),
    breed: Joi.string(),
    gender: Joi.string().allow(''),
    description: Joi.string().allow(''),
    pet_photos: Joi.array()
})

const item = {add, update}

export default item