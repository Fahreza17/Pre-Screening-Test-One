import { PrismaClient } from "@prisma/client";
import { authenticate } from "../../../utils/authenticate";

const prisma = new PrismaClient();

export default authenticate(async function handler(req, res) {
    const { bookId } = req.query;

    if (!bookId || !parseInt(bookId)) {
        return res.status(400).json({ message: "Invalid book ID" });
    }

    switch (req.method) {
        case 'GET':
            try {
                const book = await prisma.book.findUnique({
                    where: { id: Number(bookId) },
                });

                if (!book) {
                    return res.status(404).json({ message: "Book not found" });
                }

                res.status(200).json({ book });
            } catch (err) {
                console.log(err);
                res.status(500).json({ message: "Internal Server Error" });
            }
            break;

        case 'PUT':
            try {
                const { title, author, publisher, year, pages } = req.body;
                const updatedBook = await prisma.book.update({
                    where: { id: Number(bookId) },
                    data: {
                        title,
                        author,
                        publisher,
                        year,
                        pages,
                    },
                });
                res.status(200).json({ message : "Successfuly Update Books", updatedBook });
            } catch (err) {
                console.log(err);
                res.status(500).json({ message: "Internal Server Error" });
            }
            break;

        case 'DELETE':
            try {
                const deletedBook = await prisma.book.delete({
                    where: { id: Number(bookId) },
                });
                res.status(200).json({ message: "Delete Successfully", deletedBook });
            } catch (err) {
                console.log(err);
                res.status(500).json({ message: "Internal Server Error" });
            }
            break;

        default:
            res.status(405).end();
    }
});
