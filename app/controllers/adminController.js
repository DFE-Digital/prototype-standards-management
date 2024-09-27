require('dotenv').config();
const client = require('../../middleware/contentful.js');
const previewClient = require('../../middleware/contentful-preview.js');
const managementClient = require('../../middleware/contentful-management.js');

// Helper function to fetch a standard entry by ID with error handling
async function fetchStandardById(id) {
    try {
        return await previewClient.getEntry(id);
    } catch (error) {
        console.error(`Error fetching standard with ID ${id}:`, error);
        return null; // Handle the case when the entry is not found or there's an error
    }
}

// Dashboard: Display all standards ordered by 'number' field
exports.g_dashboard = async function (req, res) {
    try {
        const results = await previewClient.getEntries({
            content_type: 'standard',
            order: 'fields.number'
        });
        const standards = results.items;

        return res.render('admin/index', { standards });
    } catch (error) {
        console.error('Error fetching standards for dashboard:', error);
        return res.status(500).send('Internal Server Error');
    }
};

// Manage Standard: Display the details of a single standard for management
exports.g_manage = async function (req, res) {
    const { id } = req.params;
    const standard = await fetchStandardById(id);

    if (!standard) {
        return res.status(404).send('Standard not found');
    }

    return res.render('admin/standard/index', { standard });
};

// Approve Standard: Display approval page
exports.g_approve = async function (req, res) {
    const { id } = req.params;
    const standard = await fetchStandardById(id);

    if (!standard) {
        return res.status(404).send('Standard not found');
    }

    return res.render('admin/standard/approve', { standard });
};

// Reject Standard: Display rejection page
exports.g_reject = async function (req, res) {
    const { id } = req.params;
    const standard = await fetchStandardById(id);

    if (!standard) {
        return res.status(404).send('Standard not found');
    }

    return res.render('admin/standard/reject', { standard });
};

// Approved Standard: Display approved page
exports.g_approved = async function (req, res) {
    const { id } = req.params;
    const standard = await fetchStandardById(id);

    if (!standard) {
        return res.status(404).send('Standard not found');
    }

    return res.render('admin/standard/approved', { standard });
};

// Rejected Standard: Display rejected page
exports.g_rejected = async function (req, res) {
    const { id } = req.params;
    const standard = await fetchStandardById(id);

    if (!standard) {
        return res.status(404).send('Standard not found');
    }

    return res.render('admin/standard/rejected', { standard });
};

// Handle Approval Form Submission
exports.p_approval = async function (req, res) {
    const { standard_id, approval } = req.body;

    if (approval === "approve") {
        return res.redirect(`/admin/standard/approve/${standard_id}`);
    } else {
        return res.redirect(`/admin/standard/reject/${standard_id}`);
    }
};

// Handle Approval Confirmation
exports.p_approve = async function (req, res) {
    const { standard_id } = req.body;
    // You might want to update the standard status in Contentful here
    return res.redirect(`/admin/standard/approved/${standard_id}`);
};

// Handle Rejection Confirmation
exports.p_reject = async function (req, res) {
    const { standard_id, withHint } = req.body;

    if (!withHint || withHint.trim() === '') {
        return res.redirect(`/admin/standard/reject/${standard_id}`);
    }

    // Save the rejection reason securely
    req.session.data = { ...req.session.data, reason: withHint };

    // Optionally, update the standard's status or add rejection reason in Contentful

    return res.redirect(`/admin/standard/rejected/${standard_id}`);
};
