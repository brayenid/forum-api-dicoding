const Joi = require('joi')

const CommentPayloadSchema = Joi.object({
  content: Joi.string().required(),
  owner: Joi.string(),
  thread: Joi.string()
})

module.exports = CommentPayloadSchema
