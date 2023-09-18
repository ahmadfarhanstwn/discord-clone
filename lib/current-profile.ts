import { auth } from "@clerk/nextjs";
import { db } from "./db";

export const CurrentProfile = async () => {
    const { userId } = await auth()

    if (!userId) return null;

    const profile = await db.profile.findFirst({
        where: {
            userId
        }}
    )

    return profile
};