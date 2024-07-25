import BadRequestError from "../Errors/BadRequestError.js";
// import NotFoundError from "../Errors.js/NotFoundError.js";
import { validationResult } from "express-validator";
import asyncWrapper from "../middleware/async.js";
import TokenModel from "../models/userToken.js"

const addToken = asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next(new BadRequestError(errors.array()[0].msg));
    }

    const newToken = await TokenModel.create(req.body);
    return res.status(201).json(newToken);
});

const findByUser = asyncWrapper(async (req, res, next) => {
    const tokenOwner = req.query.user;

    const foundToken = await TokenModel.findOne({ status: tokenOwner });
    return res.status(200).json({
        foundToken
    });
});

const deleteToken = asyncWrapper(async (req, res, next) => {
    const deletedToken = await TokenModel.findByIdAndDelete(req.query.id);
    return res.status(200).json({ message: 'Token deleted', deletedToken });
});

const tokenControllers = {
    addToken,
    findByUser,
    deleteToken
}
export default tokenControllers