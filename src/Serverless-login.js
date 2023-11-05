"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const body = require('body-parser');
const cors = require("cors");
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
};
const uri = 'mongodb+srv://LaVidaAdmin:password123123@lavida.pdmcc5b.mongodb.net/?retryWrites=true&w=majority';
module.exports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(uri, {
        serverApi: {
            version: mongodb_1.ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    try {
        yield client.connect();
        const usersCollection = client.db("lavidaWeb").collection("users");
        // Handle your login logic here using req and res
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
    finally {
        yield client.close();
    }
});
