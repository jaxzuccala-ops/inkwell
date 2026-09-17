// server/src/repositories/user.repository.js
//
to
// Per ADR-001 (Lecture 5), this is the ONLY module permitted
// query the User table directly.
import { prisma } from "../db/client.js";

export const UserRepository = {
    findByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
    },
    create({ email, displayName, passwordHash }) {
        return prisma.user.create({
            data: { email, displayName, passwordHash },
        });
    },
};