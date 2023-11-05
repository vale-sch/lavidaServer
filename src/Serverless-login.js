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
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')({
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
});
const uri = 'mongodb+srv://LaVidaAdmin:password123123@lavida.pdmcc5b.mongodb.net/?retryWrites=true&w=majority';
console.error("establishe-1");
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    console.error("established0");
    // Use CORS middleware to handle CORS headers
    cors(req, res);
    console.error("established11");
    try {
        yield client.connect();
        console.error("connection established");
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
module.exports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    console.error("established0");
    // Use CORS middleware to handle CORS headers
    cors(req, res);
    console.error("established11");
    try {
        yield client.connect();
        console.error("connection established");
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
