import supabase from "../utils/supabase";
module.exports = async (req, res) => {
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase.rpc("todos").eq("id", 1);

      // await supabase.from("todos").insert({ id: "jo", title: "kevin" });
      res.status(201).send("success!", data);
    } catch (error) {
      console.error("Error executing the query:", error);
      res.status(500).json({ error: "An error occurred while fetching users" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
