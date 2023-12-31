import { authenticate } from "../../../utils/authenticate";
import { PrismaClient } from "@prisma/client";
import multer from "multer";

const prisma = new PrismaClient();

// Multer setup
const upload = multer({ dest: "public/uploads/" });

const createBookHandler = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    try {
        upload.single("image")(req, res, async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error uploading image" });
            }

            const { title, author, publisher, year, pages } = req.body;
            const image = req.file ? `/uploads/${req.file.filename}` : null;

            const book = await prisma.book.create({
                data: {
                    title: title,
                    author: author,
                    publisher: publisher,
                    year: parseInt(year),
                    pages: parseInt(pages),
                    image: image,
                },
            });

            res.status(200).json({message: "Success Create Book" ,book });
        });
    } catch (err) {
        console.error("err", err);
        res.status(400).json({ message: "Book already exists" });
    }
};

export const config = {
    api: {
        bodyParser: false,
    },
};

export default authenticate(createBookHandler);
