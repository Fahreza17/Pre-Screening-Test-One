import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getAll(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    try {
        const books = await prisma.book.findMany();
        return res.status(200).json({ books });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
