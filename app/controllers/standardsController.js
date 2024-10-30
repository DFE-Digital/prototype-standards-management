require('dotenv').config();


const client = require('../middleware/contentful.js');

exports.g_dashboard = async function (req, res) {
    const { id } = req.params;  

    try {

        // Fetch all published standards

        const results = await client.getEntries({
            content_type: "standard",
            order: "fields.number"
        });

        // Get categories and just the title and number

        const categoryResults = await client.getEntries({
            content_type: "category",
            order: "fields.title",
            select: "fields.title, fields.number"
        });

        // Set standards if results are valid
        let standards = results?.items || [];
        let categories = categoryResults?.items || [];
        // Render the view with `standards`, `stageCounts`, and `type`
        return res.render("standards/index", { standards, categories });

    } catch (error) {
        console.error("Error fetching entries from Contentful:", error);
    }

    return res.redirect("/");

};

exports.g_preview = async function (req, res) {
  
    const {id } = req.params;

    if (id) {
        try {
            const standard = await client.getEntry(id);
            return res.render('standards/view/index', { standard });
        } catch (error) {
            console.error("Error fetching standard entry from Contentful:", error);
            req.session.data['error'] = { error: 'Failed to fetch standard entry' };
            return res.redirect('/standards');
        }
    } else {
        req.session.data['error'] = { error: 'No ID found in session data' };
        return res.redirect('/standards');
    }
}
exports.g_previewmeet = async function (req, res) {
    const { id } = req.params;

    if (id) {
        try {
            const standard = await client.getEntry(id);
            return res.render('standards/view/meet', { standard });
        } catch (error) {
            console.error("Error fetching standard entry from Contentful:", error);
            req.session.data['error'] = { error: 'Failed to fetch standard entry' };
            return res.redirect('/standards');
        }
    } else {
        req.session.data['error'] = { error: 'No ID found in session data' };
        return res.redirect('/standards');
    }
}

exports.g_previewproducts = async function (req, res) {
    const { id } = req.params;
    if (id) {
        try {
            const standard = await client.getEntry(id);
            return res.render('standards/view/products', { standard });
        } catch (error) {
            console.error("Error fetching standard entry from Contentful:", error);
            req.session.data['error'] = { error: 'Failed to fetch standard entry' };
            return res.redirect('/standards');
        }
    } else {
        req.session.data['error'] = { error: 'No ID found in session data' };
        return res.redirect('/standards');
    }
}
