import { db } from "./db";
import { NextApiRequest } from "next";
import { getAuth } from "@clerk/nextjs/server";

export const CurrentProfilePages = async (req: NextApiRequest) => {
    const { userId } = getAuth(req)

    if (!userId) return null;

    const profile = await db.profile.findFirst({
        where: {
            userId
        }}
    )

    return profile
};