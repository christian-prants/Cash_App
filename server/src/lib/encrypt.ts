import bcrypt from "bcryptjs";

export const encryptPassword = async (password: any) => {
    return (
        bcrypt.hash(password, 10)
    )
}

export const comparePassword = async(password: any, encryptedPass: any) => {
    const result = await bcrypt.compare(password, encryptedPass)
    return (
        result
    )
}