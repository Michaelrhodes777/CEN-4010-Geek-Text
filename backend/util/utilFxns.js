function deepCopier(entity) {
    return JSON.parse(JSON.stringify(entity));
}

function stdRowCleaner(entity) {
    return entity.rows[0];
}

module.exports = {
    deepCopier,
    stdRowCleaner
};