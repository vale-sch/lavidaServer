export async function CheckUser(req: any, res: any) {
    try {
        const { db } = req.app;
        const result = await db.collection('users').find().toArray();

        res.setHeader('Content-Type', 'application/json'); // Set the response content type
        res.status(200).json({
            message: "Customers retrieved",
            customers: result
        });
    } catch (error) {
        //@ts-ignore
        res.status(500).json({ error: error.toString() });
    }
}
