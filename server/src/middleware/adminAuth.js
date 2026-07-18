// Admin Authorization Middleware - checks for valid admin key

import { adminKey } from "../config/env.js";

export default function adminAuth(req, res, next) {
    const key = req.headers["x-admin-key"];

    if (!key || key !== adminKey) {
        return res.status(401).json({ error: "Only an Admin can perform this action." });
    }

    next();
}
