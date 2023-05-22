function uuidGenerator() {
    return `${new Date().toISOString().split('-').join('').split(':').join('').split(' ').join('').split('.').join('').split('T').join('').split('Z').join('')}`;
}

module.exports = uuidGenerator;