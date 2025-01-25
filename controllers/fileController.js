const Files = require("../models/fileModel");
const Rooms = require("../models/roomModel");

const API_END = "http://192.168.1.69:3003"

function convertSizes(size) {
    let differ = 1024;
    const arr = ["b", "kb", "MB", "GB"]
    let arr_idx = 1;
    
    while(size / differ > 999) {
        differ = differ * 1024;
        arr_idx++;    
    }
    arr_idx = arr_idx % 4;

    return Math.floor(size / differ) + arr[arr_idx];
}

async function post_file(req, res) {    
    const room_id = req.query.room_id;
    console.log(req.file);
    
    if(room_id) {
        const room = await Rooms.findOne({_id: room_id});
        
        if(!room) {
            return res.status(400).json({
                error: "Invalid room ID"
            })
        }

        try {
            if(req.file) {
                req.body.url =`${API_END}/${req.file.destination}/${req.file.filename}`
                req.body.size = `${convertSizes(req.file.size)}`
            }else {
                return res.status(400).json({
                    error: "Invalid file"
                })
            }
            
            Files.create(req.body).then(async (result) => {
                await room.updateOne({
                    $push: {files: result._id}
                })
                
                return res.status(201).json({
                    file: result
                })
            })
        }catch(e) {        
            return res.status(500).json({
                error: "An error occured"
            })
        }
    }
    
}


module.exports = {
    post_file,
}