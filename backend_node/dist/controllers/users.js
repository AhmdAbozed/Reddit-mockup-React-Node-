var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { body, validationResult } from 'express-validator';
import { Router } from "express";
import { usersStore } from '../models/users.js';
import dotenv from 'dotenv';
dotenv.config();
var _a = process.env, tokenSecret = _a.tokenSecret, adminTokenSecret = _a.adminTokenSecret, adminUsername = _a.adminUsername, adminPassword = _a.adminPassword, HOST_PORT_URL = _a.HOST_PORT_URL;
//const urlencodedParser = bodyParser.urlencoded({ extended: false })
var store = new usersStore();
//See express-validator docs for, docs.
var signUpPost = [
    body('Username')
        .matches(/^\w{4,20}$/).withMessage("Username must be 4-20 characters"),
    body('Email').isEmail().withMessage("Email invalid"),
    body('Password').matches(/^\w{4,20}$/).withMessage("Password must be 4-20 characters"),
    function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errorArr, submission, validation, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        errorArr = validationResult(req).array();
                        if (errorArr[0]) {
                            //An error is found
                            res.send(errorArr);
                            console.log("ErrorArr: " + JSON.stringify(errorArr));
                            console.log("express-vali validationResult(req) " + validationResult(req));
                            return [2 /*return*/];
                        }
                        submission = { username: req.body.Username, password: req.body.Password, email: req.body.Email };
                        console.log("submission thing: " + JSON.stringify(submission));
                        return [4 /*yield*/, store.validateSignUp(submission)];
                    case 1:
                        validation = _a.sent();
                        if (validation[0]) {
                            //username/email already exist
                            console.log("recieved validation: " + JSON.stringify(validation[0]));
                            res.status(403).send(JSON.stringify(validation[0]));
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, store.signup(submission)
                            //createToken(res, result)
                        ];
                    case 2:
                        result = _a.sent();
                        //createToken(res, result)
                        res.send(errorArr);
                        console.log("result/End Of Sign Up Function: " + result);
                        return [2 /*return*/];
                }
            });
        });
    }
];
var signInPost = [
    body('Username')
        .matches(/^\w{4,20}$/).withMessage("Username must be 4-20 characters"),
    body('Password').matches(/^\w{4,20}$/).withMessage("Password must be 4-20 characters"),
    function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var errorArr, submission, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        errorArr = validationResult(req).array();
                        if (errorArr[0]) {
                            //An error is found
                            res.status(403).send(errorArr);
                            console.log("ErrorArr: " + JSON.stringify(errorArr));
                            console.log("express-vali validationResult(req) " + validationResult(req));
                            return [2 /*return*/];
                        }
                        submission = { username: req.body.Username, password: req.body.Password, email: req.body.Email };
                        console.log("submission thing: " + JSON.stringify(submission));
                        return [4 /*yield*/, store.signin(submission)
                            //createToken(res, result)
                        ];
                    case 1:
                        result = _a.sent();
                        //createToken(res, result)
                        res.send(result);
                        console.log("result/End Of Sign In Function: " + result);
                        return [2 /*return*/];
                }
            });
        });
    }
];
var UsersRouter = Router();
UsersRouter.post("/users/signup", signUpPost);
UsersRouter.post("/users/signin", signInPost);
//PostsRouter.post("/posts", postPosts)
export default UsersRouter;
