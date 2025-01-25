const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FileSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: false,
    },
    size: {
        type: String,
        required: false,
    },
    expiration: {
        type: String,
        required: false,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "user",
    }
}, {
    timestamps: true
})


const Files = mongoose.model('file', FileSchema)
module.exports = Files