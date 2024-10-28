require('dotenv').config();
const client = require('../middleware/contentful.js');
const previewClient = require('../middleware/contentful-preview.js');
const managementClient = require('../middleware/contentful-management.js');

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
    const { id } = req.params;

    // Define mapping between id and display stage titles
    const stageMap = {
        approval: "Approval",
        approved: "Approved",
        published: "Published",
        rejected: "Rejected",
        archived: "Archived"
    };

    let type = stageMap[id?.toLowerCase()] || "Approval";

    let standards = []; // Placeholder for standards data
    let stageCounts = {}; // Placeholder for stage counts

    try {
        const results = await previewClient.getEntries({
            content_type: "standard",
            order: "fields.number",
        });

        // Set standards if results are valid
        standards = results?.items || [];

        // Initialise stageCounts with all stages set to 0
        Object.values(stageMap).forEach(stage => {
            stageCounts[stage] = 0;
        });

        // Count standards by stage title
        standards.forEach(standard => {
            const stageTitle = standard?.fields?.stage?.fields?.title;
            if (stageCounts.hasOwnProperty(stageTitle)) {
                stageCounts[stageTitle]++;
            }
        });
    } catch (error) {
        console.error("Error fetching entries from Contentful:", error);
    }

    // Render the view with `standards`, `stageCounts`, and `type`
    return res.render("admin/index", { standards, stageCounts, type });
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
