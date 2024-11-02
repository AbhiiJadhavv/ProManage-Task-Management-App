import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exists with this Email',
                success: false
            })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: 'Password and Confirm Password should match',
                success:false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'Please enter valid email',
                success: false
            })
        };
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: 'Incorrect Password',
                success: false
            })
        };
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            name: user.name,
            email: user.email,
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome ${user.name}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}


export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}


export const updateProfile = async (req, res) => {
    try {
        const { name, email, oldPassword, newPassword } = req.body;

        const updateTypes = [Boolean(name), Boolean(email), Boolean(oldPassword || newPassword)];
        const fieldsToUpdate = updateTypes.filter(Boolean);
        
        if (fieldsToUpdate.length !== 1) {
            return res.status(400).json({
                message: "You can only update one field at a time (name, email, or password).",
                success: false
            });
        }

        if (oldPassword || newPassword) {
            if (!oldPassword || !newPassword) {
                return res.status(400).json({
                    message: "Both old and new passwords are required to update the password.",
                    success: false
                });
            }

            if (oldPassword === newPassword) {
                return res.status(400).json({
                    message: "New password cannot be the same as the old password.",
                    success: false
                });
            }
        }

        const userId = req.userId || req.user?._id || req.id;
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        if (name) {
            user.name = name;
        }

        if (email) {
            if (email !== user.email) {
                const existingEmailUser = await User.findOne({ email });
                if (existingEmailUser) {
                    return res.status(400).json({ message: "This email already exists", success: false });
                }
                user.email = email;
            }
        }

        if (oldPassword && newPassword) {
            const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordMatch) {
                return res.status(400).json({
                    message: "Old password is incorrect.",
                    success: false
                });
            }
            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();

        const updatedUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: updatedUser,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};


export const getUserEmails = async (req, res) => {
    try {
        const users = await User.find({}, 'email');
        const emails = users.map(user => user.email);
        res.json(emails); 
    } catch (error) {
        console.error("Error fetching user emails:", error);
        res.status(500).json({ error: "Failed to fetch user emails" });
    }
};