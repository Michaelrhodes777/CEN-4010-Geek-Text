function deepCopier(entity) {
    return JSON.parse(JSON.stringify(entity));
}

function stdRowCleaner(entity) {
    return entity.rows[0];
}

function parseStringifiedArray(stringifiedArray) {
    return stringifiedArray.substring(1, stringifiedArray.length - 1).split(",");
}

module.exports = {
    deepCopier,
    stdRowCleaner,
    parseStringifiedArray
};