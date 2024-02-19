const numeric = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ];
const lowercase = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z" ];
const uppercase = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ];
const alphabetical = [ ...lowercase, ...uppercase ];
const alphanumeric = [ ...numeric, ...lowercase, ...uppercase ];
const specialCharacters = [ "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "\\", "-", "=", "[", "]", "{", "}", ";", ":", "|", ",", ".", "<", ">", "/", "?", "*" ];
const alphanumericSpecial = [ ...alphanumeric, ...specialCharacters ];
const datestampWhitelist = [ ":", "-", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ];
const stdBlacklist = [ "\"", "\'", "'", "\\", "/" ];

class StandardLists {
    static numeric = numeric;
    static lowercase = lowercase;
    static uppercase = uppercase;
    static alphabetical = alphabetical;
    static alphanumeric = alphanumeric;
    static specialCharacters = specialCharacters;
    static alphanumericSpecial = alphanumericSpecial;
    static datestampWhitelist = datestampWhitelist;
    static stdBlacklist = stdBlacklist;
}

module.exports = StandardLists;