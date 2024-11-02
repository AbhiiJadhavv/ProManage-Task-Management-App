import express from "express";
import { getUserEmails, login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../auth/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post( isAuthenticated, updateProfile);
router.route("/emails").get(getUserEmails);

export default router;
