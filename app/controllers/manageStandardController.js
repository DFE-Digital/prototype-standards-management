require("dotenv").config();
const client = require("../../middleware/contentful.js");
const previewClient = require("../../middleware/contentful-preview.js");
const managementClient = require("../../middleware/contentful-management.js");

function generateRandomId() {
    return Math.random().toString(36).substr(2, 9); // Generates a random string
}

// GETS //

exports.g_dashboard = async function (req, res) {
    const results = await previewClient.getEntries({
        content_type: "standard",
        order: "fields.number",
    });

    const standards = results.items;

    return res.render("manage/index", { standards });
};

exports.g_manage = async function (req, res) {
    const { id } = req.params;
    const standard = await previewClient.getEntry(id);

    return res.render("manage/standard/index", { standard });
};

exports.g_manage_purpose = async function (req, res) {
    const { id } = req.params;
    const standard = await previewClient.getEntry(id);

    const success = req.session.success;

    req.session.success = null;

    return res.render("manage/standard/purpose", { standard, success });
};

exports.g_manage_guidance = async function (req, res) {
    const { id } = req.params;
    const standard = await previewClient.getEntry(id);

    const success = req.session.success;

    req.session.success = null;

    return res.render("manage/standard/guidance", { standard, success });
};

exports.g_manage_considerations = async function (req, res) {
    const { id } = req.params;
    const standard = await previewClient.getEntry(id);

    const success = req.session.success;

    req.session.success = null;

    return res.render("manage/standard/considerations", { standard, success });
};

exports.g_manage_templates = async function (req, res) {
    const { id } = req.params;
    const standard = await previewClient.getEntry(id);

    const success = req.session.success;

    req.session.success = null;

    return res.render("manage/standard/templates", { standard, success });
};

exports.g_manage_products = async function (req, res) {
    const { id } = req.params;
    const standard = await previewClient.getEntry(id);

    return res.render("manage/standard/products", { standard });
};

exports.g_manage_addapprovedproducts = async function (req, res) {
    const { id } = req.params;
    const standard = await previewClient.getEntry(id);

    return res.render("manage/standard/add-approved-product", { standard });
};

exports.g_manage_addtoleratedproducts = async function (req, res) {
    const { id } = req.params;
    const standard = await previewClient.getEntry(id);

    return res.render("manage/standard/add-tolerated-product", { standard });
};

exports.g_manage_exceptions = async function (req, res) {
    const { id } = req.params;
    const standard = await previewClient.getEntry(id);

    return res.render("manage/standard/exceptions", { standard });
};

exports.g_manage_addexception = async function (req, res) {
    const { id } = req.params;
    const standard = await previewClient.getEntry(id);

    return res.render("manage/standard/add-exception", { standard });
};

exports.g_manage_manageexception = async function (req, res) {
    const { id, exceptionid } = req.params;
    const standard = await previewClient.getEntry(id);
    const exception = await previewClient.getEntry(exceptionid);

    return res.render("manage/standard/manage-exception", {
        standard,
        exception,
    });
};

exports.g_manage_contacts = async function (req, res) {
    const { id } = req.params;
    const standard = await previewClient.getEntry(id);

    return res.render("manage/standard/contacts", { standard });
};

exports.g_manage_addcontact = async function (req, res) {
    const { id } = req.params;
    const standard = await previewClient.getEntry(id);

    const response = await client.getEntries({
        content_type: "person",
        order: "fields.name",
        select: "fields.name,fields.emailAddress",
    });

    const people = response.items.map((item) => {
        return {
            text: item.fields.name,
            value: item.fields.emailAddress,
        };
    });

    return res.render("manage/standard/add-contact", { standard, people });
};

exports.g_manage_removeownercontact = async function (req, res) {
    const { standardid, id } = req.params;

    try {
        // Fetch the space and environment using the management client
        const space = await managementClient.getSpace(process.env.spaceID);
        const environment = await space.getEnvironment(process.env.environmentID);

        // Fetch the mutable entry from Contentful using the management API
        const standard = await environment.getEntry(standardid);

        // Check if the 'owners' field exists and is not empty
        if (standard.fields.owners && standard.fields.owners["en-US"]) {
            // Filter out the contact with the matching id
            const updatedOwners = standard.fields.owners["en-US"].filter(
                (owner) => owner.sys.id !== id,
            );

            // Update the owners field
            standard.fields.owners["en-US"] = updatedOwners;

            // Save the updated entry
            const updatedStandard = await standard.update();
            //await updatedStandard.publish(); // Ensure the entry is published after update

            // Redirect back to the contacts page
            return res.redirect("/manage/standard/contacts/" + standardid);
        } else {
            // If no owners field exists or it's empty
            req.session.error = "No owners found to remove";
            return res.redirect("/manage/standard/contacts/" + standardid);
        }
    } catch (error) {
        console.error("Error removing owner contact:", error);
        req.session.error = "Error removing the owner contact";
        return res.redirect("/manage/standard/contacts/" + standardid);
    }
};

exports.g_manage_removetechnicalcontact = async function (req, res) {
    const { standardid, id } = req.params;

    try {
        // Fetch the space and environment using the management client
        const space = await managementClient.getSpace(process.env.spaceID);
        const environment = await space.getEnvironment(process.env.environmentID);

        // Fetch the mutable entry from Contentful using the management API
        const standard = await environment.getEntry(standardid);

        // Check if the 'technicalContacts' field exists and is not empty
        if (
            standard.fields.technicalContacts &&
            standard.fields.technicalContacts["en-US"]
        ) {
            // Filter out the contact with the matching id
            const updatedTechnicalContacts = standard.fields.technicalContacts[
                "en-US"
            ].filter((contact) => contact.sys.id !== id);

            // Update the technicalContacts field
            standard.fields.technicalContacts["en-US"] = updatedTechnicalContacts;

            // Save the updated entry
            const updatedStandard = await standard.update();
            //await updatedStandard.publish(); // Ensure the entry is published after update

            // Redirect back to the contacts page
            return res.redirect("/manage/standard/contacts/" + standardid);
        } else {
            // If no technicalContacts field exists or it's empty
            req.session.error = "No technical contacts found to remove";
            return res.redirect("/manage/standard/contacts/" + standardid);
        }
    } catch (error) {
        console.error("Error removing technical contact:", error);
        req.session.error = "Error removing the technical contact";
        return res.redirect("/manage/standard/contacts/" + standardid);
    }
};

exports.g_manage_removeapprovedproduct = async function (req, res) {
    const { standardid, id } = req.params;

    try {
        // Fetch the space and environment using the management client
        const space = await managementClient.getSpace(process.env.spaceID);
        const environment = await space.getEnvironment(process.env.environmentID);

        // Fetch the mutable entry from Contentful using the management API
        const standard = await environment.getEntry(standardid);

        // Check if the 'approvedProducts' field exists and is not empty
        if (
            standard.fields.approvedProducts &&
            standard.fields.approvedProducts["en-US"]
        ) {
            // Filter out the product with the matching id
            const updatedApprovedProducts = standard.fields.approvedProducts[
                "en-US"
            ].filter((product) => product.sys.id !== id);

            // Update the approvedProducts field
            standard.fields.approvedProducts["en-US"] = updatedApprovedProducts;

            // Save the updated entry
            const updatedStandard = await standard.update();
            //await updatedStandard.publish(); // Ensure the entry is published after update

            // Redirect back to the products page
            return res.redirect("/manage/standard/products/" + standardid);
        } else {
            // If no approvedProducts field exists or it's empty
            req.session.error = "No approved products found to remove";
            return res.redirect("/manage/standard/products/" + standardid);
        }
    } catch (error) {
        console.error("Error removing approved product:", error);
        req.session.error = "Error removing the approved product";
        return res.redirect("/manage/standard/products/" + standardid);
    }
};

exports.g_manage_movetoreview = async function (req, res) {
    const { id } = req.params;
    const standard = await previewClient.getEntry(id);

    return res.render("manage/standard/movestage", { standard });
};

exports.g_manage_index2 = async function (req, res) {
    const { id } = req.params;
    const standard = await previewClient.getEntry(id);

    return res.render("manage/standard/index2", { standard });
};

// POSTS //

exports.p_manage_purpose = async function (req, res) {
    const { standard_id, purpose } = req.body;

    // Update the standard guidance field in contentful
    let result = await updatePurposeField(standard_id, purpose);

    console.log(result);

    req.session.success = true;

    return res.redirect("/manage/standard/purpose/" + result.sys.id);
};

exports.p_manage_guidance = async function (req, res) {
    const { standard_id, guidance } = req.body;

    // Update the standard guidance field in contentful
    let result = await updateComplianceField(standard_id, guidance);

    console.log(result);

    req.session.success = true;

    return res.redirect("/manage/standard/guidance/" + result.sys.id);
};

exports.p_manage_considerations = async function (req, res) {
    const { standard_id, considerations } = req.body;

    console.log(considerations);

    let result = await updateConsiderationsField(standard_id, considerations);

    console.log(result);

    req.session.success = true;

    return res.redirect("/manage/standard/considerations/" + result.sys.id);
};

exports.p_manage_templates = async function (req, res) {
    const { standard_id, templates } = req.body;

    console.log(templates);

    let result = await updateTemplatesField(standard_id, templates);

    console.log(result);

    req.session.success = true;

    return res.redirect("/manage/standard/templates/" + result.sys.id);
};

exports.p_manage_addexception = async function (req, res) {
    const { standard_id, exception, exceptiondetail } = req.body;

    // First, create the exception entry
    const newExceptionEntry = await createException({
        exception,
        exceptiondetail,
    });

    if (newExceptionEntry) {
        // Then, update the standard to link the new exception entry
        const updatedStandard = await updateExceptionField(
            standard_id,
            newExceptionEntry.sys.id,
        );

        return res.redirect(
            "/manage/standard/exceptions/" + updatedStandard.sys.id,
        );
    } else {
        req.session.error = "Error creating the exception";
        return res.redirect("/manage/standard/exceptions/" + standard_id);
    }
};

exports.p_manage_manageexception = async function (req, res) {
    const { standard_id, exception_id, exception, exceptiondetail } = req.body;

    // Check which button was clicked
    if (req.body.action === "delete") {
        // Delete the exception
        const deleted = await deleteException(exception_id, standard_id);
        if (deleted) {
            req.session.success = "Exception deleted successfully";
        } else {
            req.session.error = "Error deleting the exception";
        }
    }

    if (req.body.action === "save") {
        // Update the exception
        const updated = await updateException(exception_id, {
            exception,
            exceptiondetail,
        });
        if (updated) {
            req.session.success = "Exception updated successfully";
        } else {
            req.session.error = "Error updating the exception";
        }
    }

    // Redirect or handle result
    return res.redirect("/manage/standard/exceptions/" + standard_id);
};

exports.p_manage_addcontact = async function (req, res) {
    const { standard_id, contactType, people } = req.body;

    try {
        // if an contact type is selected and its owner, get the person and their ID and associate with the Owner on the standard

        const response = await client.getEntries({
            content_type: "person",
            "fields.emailAddress": people,
        });

        const person = response.items[0]; // Get the first result

        console.log(person);
        if (contactType === "Owner") {
            const result = await addOwnerContact(standard_id, person.sys.id);
            if (result) {
                req.session.success = "Owner contact added successfully";
            } else {
                req.session.error = "Error adding the owner contact";
            }
        }

        if (contactType === "Technical contact") {
            const result = await addTechnicalContact(standard_id, person.sys.id);
            if (result) {
                req.session.success = "Tech contact added successfully";
            } else {
                req.session.error = "Error adding the tech contact";
            }
        }
    } catch (error) {
        console.error("Error adding owner contact:", error);
        req.session.error = "Error adding the owner contact";
    }

    return res.redirect("/manage/standard/contacts/" + standard_id);
};

exports.p_manage_addapprovedproduct = async function (req, res) {
    const {
        standard_id,
        approved_name,
        approved_vendor,
        approved_version,
        approved_usecase,
    } = req.body;

    // Create a new product entry

    const newProductEntry = await createApprovedProductEntry({
        product: approved_name,
        vendor: approved_vendor,
        version: approved_version,
        usecase: approved_usecase,
    });

    if (newProductEntry) {
        // Update the standard to link the new product entry
        const updatedStandard = await updateApprovedProductsField(
            standard_id,
            newProductEntry.sys.id,
        );

        return res.redirect("/manage/standard/products/" + updatedStandard.sys.id);
    }

    req.session.error = "Error creating the approved product";
    return res.redirect("/manage/standard/products/" + standard_id);
};

exports.p_manage_movestage = async function (req, res) {
    const { standard_id } = req.body;

    return res.redirect("/manage/standard/index2/" + standard_id);
};


async function getSpaceAndEnvironment() {
    const spaceId = process.env.spaceID;
    const environmentId = process.env.environmentID;
    const space = await managementClient.getSpace(spaceId);
    return await space.getEnvironment(environmentId);
}

async function handleError(action, error) {
    console.error(`Error ${action}:`, error);
    throw error; // Rethrow for upstream handling if needed
}

async function createEntry(entryType, fields) {
    try {
        const environment = await getSpaceAndEnvironment();
        const newEntry = await environment.createEntry(entryType, { fields });
        await newEntry.publish();
        console.log(`${entryType} entry created successfully:`, newEntry.sys.id);
        return newEntry;
    } catch (error) {
        handleError(`creating ${entryType} entry`, error);
    }
}

async function updateEntry(entryId, updateFields) {
    try {
        const environment = await getSpaceAndEnvironment();
        const entry = await environment.getEntry(entryId);
        Object.assign(entry.fields, updateFields);
        const updatedEntry = await entry.update();
        console.log(`Entry ${entryId} updated successfully.`);
        return updatedEntry;
    } catch (error) {
        handleError(`updating entry ${entryId}`, error);
    }
}

async function createApprovedProductEntry({ product, vendor, version, usecase }) {
    return createEntry("approvedProducts", {
        product: { "en-US": product },
        vendor: { "en-US": vendor },
        version: { "en-US": version },
        useCase: { "en-US": usecase },
    });
}

async function updateApprovedProductsField(entryId, newProductEntryId) {
    const updateFields = {};
    const environment = await getSpaceAndEnvironment();
    const entry = await environment.getEntry(entryId);

    if (!entry.fields.approvedProducts) {
        entry.fields.approvedProducts = { "en-US": [] };
    }

    entry.fields.approvedProducts["en-US"].push({
        sys: { type: "Link", linkType: "Entry", id: newProductEntryId },
    });

    return await updateEntry(entryId, updateFields);
}

async function updateComplianceField(entryId, newCompliance) {
    return await updateEntry(entryId, {
        compliance: { "en-US": newCompliance },
    });
}

async function updatePurposeField(entryId, purpose) {
    return await updateEntry(entryId, {
        purpose: { "en-US": purpose },
    });
}

async function updateExceptionField(standardId, exceptionEntryId) {
    const updateFields = {};
    const environment = await getSpaceAndEnvironment();
    const standardEntry = await environment.getEntry(standardId);

    if (!standardEntry.fields.exceptions) {
        standardEntry.fields.exceptions = { "en-US": [] };
    }

    standardEntry.fields.exceptions["en-US"].push({
        sys: { type: "Link", linkType: "Entry", id: exceptionEntryId },
    });

    return await updateEntry(standardId, updateFields);
}

async function createException({ exception, exceptiondetail }) {
    return createEntry("exceptions", {
        title: { "en-US": exception },
        details: { "en-US": exceptiondetail },
        active: { "en-US": true },
    });
}

async function deleteException(exceptionId, standardId) {
    try {
        const environment = await getSpaceAndEnvironment();
        const standardEntry = await environment.getEntry(standardId);
        if (!standardEntry) throw new Error(`Standard with ID ${standardId} not found.`);

        if (standardEntry.fields.exceptions?.["en-US"]) {
            standardEntry.fields.exceptions["en-US"] = standardEntry.fields.exceptions["en-US"].filter(
                (exception) => exception.sys.id !== exceptionId,
            );

            await standardEntry.update();
            console.log(`Updated standard with ID ${standardId} to remove the exception.`);
        }

        const exceptionEntry = await environment.getEntry(exceptionId);
        if (!exceptionEntry) throw new Error(`Exception with ID ${exceptionId} not found.`);

        if (exceptionEntry.isPublished()) {
            await exceptionEntry.unpublish();
        }

        await exceptionEntry.delete();
        console.log(`Exception with ID ${exceptionId} deleted successfully.`);
        return true;
    } catch (error) {
        handleError("deleting exception or updating standard", error);
        return false;
    }
}

async function updateException(exceptionId, { exception, exceptiondetail }) {
    return await updateEntry(exceptionId, {
        title: { "en-US": exception },
        details: { "en-US": exceptiondetail },
    });
}

// Utility functions for updating fields
async function updateField(entryId, fieldName, value) {
    return await updateEntry(entryId, {
        [fieldName]: { "en-US": value },
    });
}

async function updateConsiderationsField(entryId, considerations) {
    return await updateField(entryId, 'considerations', considerations);
}

async function updateTemplatesField(entryId, templates) {
    return await updateField(entryId, 'templates', templates);
}

async function addContact(entryId, contactId, contactType) {
    const environment = await getSpaceAndEnvironment();
    const entry = await environment.getEntry(entryId);

    if (!entry.fields[contactType]) {
        entry.fields[contactType] = { "en-US": [] };
    }

    entry.fields[contactType]["en-US"].push({
        sys: { type: "Link", linkType: "Entry", id: contactId },
    });

    return await entry.update();
}

async function addOwnerContact(entryId, contactId) {
    return await addContact(entryId, contactId, 'owners');
}

async function addTechnicalContact(entryId, contactId) {
    return await addContact(entryId, contactId, 'technicalContacts');
}
