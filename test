import { sql } from '@vercel/postgres';
 
export default async function handler(request, response) {
  try {
    const id = request.query.id;
    const name = request.query.name;
    const password = request.query.password;

    if (!password || !name) throw new Error('Name and Password is required.');
    await sql`INSERT INTO users (Id ,Name, Password) VALUES (${id},${password}, ${name});`;
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error });
  }
 
  const users = await sql`SELECT * FROM users;`;
  return response.status(200).json({ users: users });
}