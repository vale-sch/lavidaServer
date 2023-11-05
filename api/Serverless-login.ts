const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')({
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
});

const uri = 'mongodb+srv://LaVidaAdmin:password123123@lavida.pdmcc5b.mongodb.net/?retryWrites=true&w=majority';
console.error("establishe-1");

module.exports = async (req: any, res: any) => {
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
        await client.connect();
        console.error("connection established");

        // Handle your login logic here using req and res
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }
};
