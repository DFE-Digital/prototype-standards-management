const cache = new Map();


function clearCache() {
    cache.clear();
    console.log('Cache cleared');
}


function removeFromCache(id) {
    cache.delete(id);
    console.log(`Cache entry for ID ${id} removed`);
}

module.exports = { cache, clearCache, removeFromCache }