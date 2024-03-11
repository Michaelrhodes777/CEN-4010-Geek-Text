const bcrypt = require("bcrypt");
const NUM_HASHES = 11;

class Hashing {
    static async hashPassword(password) {
        await bcrypt.hash(password, NUM_HASHES, function(error, hash) {
            if (error) {
                throw new Error("hashing error");
            }
            return hash;
        });
    }

    static hashPasswordSync(password) {
        return bcrypt.hashSync(password, NUM_HASHES);
    }

    static async comparePasswords(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}

module.exports = Hashing;