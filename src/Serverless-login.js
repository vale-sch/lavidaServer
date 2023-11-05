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
console.log("connection established");
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')({
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
});
console.log("connection established");
const uri = 'mongodb+srv://LaVidaAdmin:password123123@lavida.pdmcc5b.mongodb.net/?retryWrites=true&w=majority';
module.exports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("connection established");
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    // Use CORS middleware to handle CORS headers
    cors(req, res, () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log("connection established");
            // Handle your login logic here using req and res
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
        finally {
            yield client.close();
        }
    }));
});
