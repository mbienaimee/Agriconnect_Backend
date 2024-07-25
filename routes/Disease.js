import express from "express";
const diseaseRouter = express.Router();
import DiseaseControllers from "../Controllers/Disease.js";
// import allValidation from "../utils/validation.js";
// import checkUsers from "../middleware/authorisation.js";
import { upload } from "../utils/uploadImage.js";


diseaseRouter.post('/addDisease', upload.single('Image'),DiseaseControllers.addDisease);
diseaseRouter.get('/list',DiseaseControllers.getAllDiseases);
diseaseRouter.get('/findById/:id',DiseaseControllers.findById);
diseaseRouter.put('/update/:id',DiseaseControllers.updateDisease);
diseaseRouter.delete('/delete/:id',DiseaseControllers.deleteDisease);

export default diseaseRouter;