require('dotenv').config();
const client = require('../middleware/contentful.js');
const previewClient = require('../middleware/contentful-preview.js');
const managementClient = require('../middleware/contentful-management.js');



exports.g_home = async function (req, res) {
   req.session.data = {};

    const data = await previewClient.getEntries({
        content_type: 'standard',
        'fields.creator': req.session.User.EmailAddress
    });

    let standards = data.items;

    res.render('index', { standards });
}