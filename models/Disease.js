import mongoose from "mongoose";

const DiseaseSchema = new mongoose.Schema({
    DiseaseName:{
        type: String,
        required: true
    },
    Description:{
        type: String,
        required: true
    },
    Solution:{
        type: String,
        required: true
    },
    Image: {
       url:{
        type: String
       }
    },
    AgronomistId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
});

const DiseaseModel = mongoose.model('Disease', DiseaseSchema);
export default DiseaseModel;