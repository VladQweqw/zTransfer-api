const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique:true,
    },
    password: {
        type: String,
        required: true,
    },
    joined_rooms: [{
        type: Schema.Types.ObjectId,
        ref: "room",
    }]
}, {
    timestamps: true
})


const Users = mongoose.model('user', UserSchema)
module.exports = Users