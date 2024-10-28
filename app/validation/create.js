const { check, validationResult } = require('express-validator');

exports.validateTitle = [
    check('title')
        .trim()
        .custom((value, { req }) => {
            if (value === '') {
                throw new Error('Enter a title');
            }
            return true;
        })
];