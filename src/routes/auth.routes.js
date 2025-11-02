import { Router } from "express";
import { login, register, profile } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.js";
const r = Router();
r.post("/register", register);
r.post("/login", login);
r.get("/profile", verifyJWT, profile);
export default r;
