const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')({
    origin: ['https://vale-sch.github.io', 'http://127.0.0.1:5500'],
});

const uri = 'mongodb+srv://LaVidaAdmin:password123123@lavida.pdmcc5b.mongodb.net/?retryWrites=true&w=majority';
module.exports = async (req: any, res: any) => {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    // Use CORS middleware to handle CORS headers
    cors(req, res, async () => {
        try {
            await client.connect();

            // Handle your login logic here using req and res
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        } finally {
            await client.close();
        }
    });
};
