const fs = require("fs");
let users = require('./tables/data_seeding/users.json');

for (let user of users) {
    user.password = user.password + user.password + user.password;
}

users = JSON.stringify(users);

fs.writeFile('./tables/data_seeding/users_corrected.json', users, 'utf8', (error) => {
    if (error) {
        console.log("error has occured");
    }
});