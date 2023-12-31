import jwt from 'jsonwebtoken';

export function authenticate(handler) {
    return async (req, res) => {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        try {
            if (!token) throw new Error("Token not provided");

            const user = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = user.userId;

            return handler(req, res);
        } catch (error) {
            console.error(error);

            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            }

            return res.status(401).json({ message: "Unauthorized" });
        }
    };
}
