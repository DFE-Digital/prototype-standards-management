require('dotenv').config();
const client = require('../middleware/contentful.js');
const previewClient = require('../middleware/contentful-preview.js');
const managementClient = require('../middleware/contentful-management.js');

const createStandardEntry = require('../middleware/standards.js');



const { updateTitle, updateSummary, updateCategories, updatePurpose, updateGuidance, createApprovedProductEntry, updateApprovedProductsField, createToleratedProductEntry, updateToleratedProductsField, removeApprovedProductsField, updateApprovedProduct, createExceptionEntry, updateExceptionField, updateException, removeExceptionField, createPerson, updateContactField, removeContactField, updateSubCategories, updateStatus, deleteEntry, updateToDraft } = require('../data/contentful/updates.js');

const { slugify } = require('../middleware/tools.js');

function generateRandomId() {
    return Math.random().toString(36).substr(2, 9); // Generates a random string
}

async function getNextStandardNumber() {
    // Get the last standard number from the database and increment it by 1

    const response = await previewClient.getEntries({
        content_type: 'standard',
        order: '-fields.number',
        limit: 1
    });

    const lastStandard = response.items[0];

    let newNumber = 0;

    if (lastStandard) {
        newNumber = parseInt(lastStandard.fields.number) + 1;
    }

    console.log(newNumber)

    return newNumber

}

async function getStageID(stageNumber) {

    const stage = await client.getEntries({
        content_type: 'stage',
        'fields.number': stageNumber
    });

    return stage.items[0].sys.id;
}

// GETS //

exports.g_create = async function (req, res) {

    let error = "";

    if (req.session.data && req.session.data['error']) {
        error = req.session.data['error'];
        req.session.data['error'] = "";
    }

    console.log(req.session.User);

    const stageId = await getStageID(10);

    const data = await previewClient.getEntries({
        content_type: 'standard',
        'fields.stage.sys.id': stageId,
        'fields.creator': req.session.User.EmailAddress
    });

    let drafts = data.items;

    res.render('create/index', { drafts, error });
}

exports.g_standardcreate = async function (req, res) {

    if (!req.session.data) {
        req.session.data = {};
    }

    let number = await getNextStandardNumber();

    // Create a new standard and put the ID into session
    const newStandard = {
        title: '',
        stageId: await getStageID(10),
        number: number,
        owners: [],
        technicalContacts: [],
        summary: '',
        purpose: '',
        compliance: '',
        considerations: '',
        templates: '',
        relatedGuidance: '',
        slug: '',
        version: 0.1,
        previousVersion: 0.0,
        approvedProducts: [],
        toleratedProducts: [],
        exceptions: [],
        category: [],
        subCategory: [],
        creator: req.session.User.EmailAddress,
    }


    const standard = await createStandardEntry(newStandard);


    if (standard) {
        req.session.data['id'] = standard;
        res.redirect('/create/standard');
    } else {
        req.session.data['error'] = { error: 'No ID found in session data' };
        return res.redirect('/create');
    }


}

exports.g_standard_tasks = async function (req, res) {

    if (!req.session.data) {
        req.session.data = {};
    }

    let id = req.session.data['id'];

    if (id) {
        try {
            const standard = await previewClient.getEntry(id);
            return res.render('create/standard/index', { standard });
        } catch (error) {
            console.error("Error fetching standard entry from Contentful:", error);
            req.session.data['error'] = { error: 'Failed to fetch standard entry' };
            return res.redirect('/create');
        }
    } else {
        req.session.data['error'] = { error: 'No ID found in session data' };
        return res.redirect('/create');
    }


}


exports.g_success = async function (req, res) {

    if (!req.session.data) {
        req.session.data = {};
    }

    let id = req.session.data['id'];

    if (id) {
        try {
            const standard = await previewClient.getEntry(id);
            return res.render('create/standard/success', { standard });
        } catch (error) {
            console.error("Error fetching standard entry from Contentful:", error);
            req.session.data['error'] = { error: 'Failed to fetch standard entry' };
            return res.redirect('/create');
        }
    } else {
        req.session.data['error'] = { error: 'No ID found in session data' };
        return res.redirect('/create');
    }
}


exports.g_confirmdelete = async function (req, res) {
    if (!req.session.data) {
        req.session.data = {};
    }

    let id = req.session.data['id'];

    if (id) {
        try {
            const standard = await previewClient.getEntry(id);
            return res.render('create/standard/confirm-delete', { standard });
        } catch (error) {
            console.error("Error fetching standard entry from Contentful:", error);
            req.session.data['error'] = { error: 'Failed to fetch standard entry' };
            return res.redirect('/create');
        }
    } else {
        req.session.data['error'] = { error: 'No ID found in session data' };
        return res.redirect('/create');
    }
}

exports.g_deleted = async function (req, res) {

req.session.data = {};  

    return res.render('create/standard/deleted');

}



exports.g_standard_getdraft = async function (req, res) {

    req.session.data = {};

    const { id } = req.params;

    // Get drafts from contentful

    try {
        const draft = await previewClient.getEntry(id);

        req.session.data['id'] = id;

        return res.redirect('/create/standard');
    }
    catch (error) {

        req.session.data['error'] = { error: 'Draft not found' };

        return res.redirect('/create');
    }
}

exports.g_preview = async function (req, res) {
    if (!req.session.data) {
        req.session.data = {};
    }

    let id = req.session.data['id'];

    if (id) {
        try {
            const standard = await previewClient.getEntry(id);
            return res.render('create/standard/preview', { standard });
        } catch (error) {
            console.error("Error fetching standard entry from Contentful:", error);
            req.session.data['error'] = { error: 'Failed to fetch standard entry' };
            return res.redirect('/create');
        }
    } else {
        req.session.data['error'] = { error: 'No ID found in session data' };
        return res.redirect('/create');
    }
}
exports.g_previewmeet = async function (req, res) {
    if (!req.session.data) {
        req.session.data = {};
    }

    let id = req.session.data['id'];

    if (id) {
        try {
            const standard = await previewClient.getEntry(id);
            return res.render('create/standard/preview-meet', { standard });
        } catch (error) {
            console.error("Error fetching standard entry from Contentful:", error);
            req.session.data['error'] = { error: 'Failed to fetch standard entry' };
            return res.redirect('/create');
        }
    } else {
        req.session.data['error'] = { error: 'No ID found in session data' };
        return res.redirect('/create');
    }
}

exports.g_previewproducts = async function (req, res) {
    if (!req.session.data) {
        req.session.data = {};
    }

    let id = req.session.data['id'];

    if (id) {
        try {
            const standard = await previewClient.getEntry(id);
            return res.render('create/standard/preview-products', { standard });
        } catch (error) {
            console.error("Error fetching standard entry from Contentful:", error);
            req.session.data['error'] = { error: 'Failed to fetch standard entry' };
            return res.redirect('/create');
        }
    } else {
        req.session.data['error'] = { error: 'No ID found in session data' };
        return res.redirect('/create');
    }
}



exports.g_title = async function (req, res) {
    // Get the ID out of the session and get it from the DB, on the post we'll update the DB

    if (!req.session.data) {
        req.session.data = {};
    }

    let id = req.session.data['id'];

    if (id) {
        try {
            const standard = await previewClient.getEntry(id);
            return res.render('create/standard/title', { standard });
        } catch (error) {
            console.error("Error fetching standard entry from Contentful:", error);
            req.session.data['error'] = { error: 'Failed to fetch standard entry' };
            return res.redirect('/create');
        }
    } else {
        req.session.data['error'] = { error: 'No ID found in session data' };
        return res.redirect('/create');
    }
}

exports.g_summary = async function (req, res) {
    // Get the ID out the session and get it from the DB, on the post we'll update the DB

    if (!req.session.data) {
        return res.redirect('/create/standard');
    }

    let id = req.session.data['id'];

    if (id) {
        try {
            const standard = await previewClient.getEntry(id);
            return res.render('create/standard/summary', { standard });
        } catch (error) {
            console.error("Error fetching standard entry from Contentful:", error);
            req.session.data['error'] = { error: 'Failed to fetch standard entry' };
            return res.redirect('/create');
        }
    } else {
        req.session.data['error'] = { error: 'No ID found in session data' };
        return res.redirect('/create');
    }
}



exports.g_categories = async function (req, res) {
    if (!req.session.data) {
        return res.redirect('/create/standard');
    }

    const response = await client.getEntries({
        content_type: 'category',
        order: 'fields.title',
        select: 'fields.title,fields.number',
        'fields.active': true
    });

    const categories = response.items.map(item => {
        return {
            text: item.fields.title,
            value: item.sys.id
        }
    });

    let id = req.session.data['id'];

    if (id) {
        try {
            const standard = await previewClient.getEntry(id);
            return res.render('create/standard/categories', { categories, standard });
        } catch (error) {
            console.error("Error fetching standard entry from Contentful:", error);
            req.session.data['error'] = { error: 'Failed to fetch standard entry' };
            return res.redirect('/create');
        }
    } else {
        req.session.data['error'] = { error: 'No ID found in session data' };
        return res.redirect('/create');
    }
}


exports.g_subcategories = async function (req, res) {

    if (!req.session.data) {
        return res.redirect('/create/standard');
    }

    let id = req.session.data['id'];

    // Get the sub categories
    try {
        const response = await client.getEntries({
            content_type: 'subCategory',
            order: 'fields.title'
        });

        const subcategories = response.items.map(item => {
            return {
                text: item.fields.title,
                value: item.sys.id,
                category: item.fields.category.sys.id
            }
        });

        if (id) {
            try {
                const standard = await previewClient.getEntry(id);
                return res.render('create/standard/sub-categories', { standard, subcategories });
            } catch (error) {
                console.error("Error fetching standard entry from Contentful:", error);
                req.session.data['error'] = { error: 'Failed to fetch standard entry' };
                return res.redirect('/create');
            }
        } else {
            req.session.data['error'] = { error: 'No ID found in session data' };
            return res.redirect('/create');
        }

    } catch (error) {
        console.error("Error fetching subcategories from Contentful:", error);
        req.session.data['error'] = { error: 'Failed to fetch subcategories' };
        return res.redirect('/create');
    }
};




exports.g_purpose = async function (req, res) {
    // Get the ID out the session and get it from the DB, on the post we'll update the DB

    if (!req.session.data) {
        return res.redirect('/create/standard');
    }

    let id = req.session.data['id'];

    if (id) {
        try {
            const standard = await previewClient.getEntry(id);
            return res.render('create/standard/purpose', { standard });
        } catch (error) {
            console.error("Error fetching standard entry from Contentful:", error);
            req.session.data['error'] = { error: 'Failed to fetch standard entry' };
            return res.redirect('/create');
        }
    } else {
        req.session.data['error'] = { error: 'No ID found in session data' };
        return res.redirect('/create');
    }
}


exports.g_products = async function (req, res) {
    // Get the ID out the session and get it from the DB, on the post we'll update the DB

    if (!req.session.data) {
        return res.redirect('/create/standard');
    }

    let message = req.session.data['success'];

    req.session.data['success'] = "";

    let id = req.session.data['id'];

    if (id) {
        try {
            const standard = await previewClient.getEntry(id);
            return res.render('create/standard/products', { standard, message });
        } catch (error) {
            console.error("Error fetching standard entry from Contentful:", error);
            req.session.data['error'] = { error: 'Failed to fetch standard entry' };
            return res.redirect('/create');
        }
    } else {
        req.session.data['error'] = { error: 'No ID found in session data' };
        return res.redirect('/create');
    }
}


exports.g_addapprovedproduct = async function (req, res) {


    if (!req.session.data) {
        return res.redirect('/create/standard');
    }

    let id = req.session.data['id'];

    if (id) {
        try {
            const standard = await previewClient.getEntry(id);
            return res.render('create/standard/add-approved-product', { standard });
        } catch (error) {
            console.error("Error fetching standard entry from Contentful:", error);
            req.session.data['error'] = { error: 'Failed to fetch standard entry' };
            return res.redirect('/create');
        }
    } else {
        req.session.data['error'] = { error: 'No ID found in session data' };
        return res.redirect('/create');
    }
}

exports.g_manageapprovedproduct = async function (req, res) {

    const { productid } = req.params;

    if (!req.session.data) {
        return res.redirect('/create/standard');
    }

    let id = req.session.data['id'];

    if (id) {
        try {
            const standard = await previewClient.getEntry(id);
            const product = await previewClient.getEntry(productid);
            return res.render('create/standard/manage-approved-product', { standard, product });
        } catch (error) {
            console.error("Error fetching standard entry from Contentful:", error);
            req.session.data['error'] = { error: 'Failed to fetch standard entry' };
            return res.redirect('/create');
        }
    } else {
        req.session.data['error'] = { error: 'No ID found in session data' };
        return res.redirect('/create');
    }
}

exports.g_manageexception = async function (req, res) {

    const { exceptionid } = req.params;

    if (!req.session.data) {
        return res.redirect('/create/standard');
    }

    let id = req.session.data['id'];

    if (id) {
        try {
            const standard = await previewClient.getEntry(id);
            const exception = await previewClient.getEntry(exceptionid);
            return res.render('create/standard/manage-exception', { standard, exception });
        } catch (error) {
            console.error("Error fetching standard entry from Contentful:", error);
            req.session.data['error'] = { error: 'Failed to fetch standard entry' };
            return res.redirect('/create');
        }
    } else {
        req.session.data['error'] = { error: 'No ID found in session data' };
        return res.redirect('/create');
    }
}

exports.g_managecontact = async function (req, res) {

    const { contactid } = req.params;

    if (!req.session.data) {
        return res.redirect('/create/standard');
    }

    let id = req.session.data['id'];

    if (id) {
        try {
            const standard = await previewClient.getEntry(id);
            const person = await previewClient.getEntry(contactid);
            return res.render('create/standard/manage-contact', { standard, person });
        } catch (error) {
            console.error("Error fetching standard entry from Contentful:", error);
            req.session.data['error'] = { error: 'Failed to fetch standard entry' };
            return res.redirect('/create');
        }
    } else {
        req.session.data['error'] = { error: 'No ID found in session data' };
        return res.redirect('/create');
    }

}



exports.g_addtoleratedproduct = async function (req, res) {

    if (!req.session.data) {
        return res.redirect('/create/standard');
    }

    let id = req.session.data['id'];

    if (id) {
        try {
            const standard = await previewClient.getEntry(id);
            return res.render('create/standard/add-tolerated-product', { standard });
        } catch (error) {
            console.error("Error fetching standard entry from Contentful:", error);
            req.session.data['error'] = { error: 'Failed to fetch standard entry' };
            return res.redirect('/create');
        }
    } else {
        req.session.data['error'] = { error: 'No ID found in session data' };
        return res.redirect('/create');
    }
}


exports.g_removeapprovedproduct = async function (req, res) {

    const { id } = req.params;

    // Get the approed products from the session
    const approvedProducts = req.session.data.approvedProducts || [];

    // Find the index of the product to remove
    const index = approvedProducts.findIndex(product => product.id === id);

    // Remove the product from the array

    if (index > -1) {
        approvedProducts.splice(index, 1);
    }

    // Update the session data
    req.session.data.approvedProducts = approvedProducts;

    return res.render('create/standard/products')

}

exports.g_removeatoleratedproduct = async function (req, res) {

    const { id } = req.params;

    // Get the approed products from the session

    const toleratedProducts = req.session.data.toleratedProducts || [];

    // Find the index of the product to remove

    const index = toleratedProducts.findIndex(product => product.id === id);

    // Remove the product from the array

    if (index > -1) {

        toleratedProducts.splice(index, 1);
    }

    // Update the session data

    req.session.data.toleratedProducts = toleratedProducts;

    return res.render('create/standard/products')

}

exports.g_exceptions = async function (req, res) {

    if (!req.session.data) {
        return res.redirect('/create/standard');
    }

    let id = req.session.data['id'];

    if (id) {
        try {
            const standard = await previewClient.getEntry(id);
            return res.render('create/standard/exceptions', { standard });
        } catch (error) {
            console.error("Error fetching standard entry from Contentful:", error);
            req.session.data['error'] = { error: 'Failed to fetch standard entry' };
            return res.redirect('/create');
        }
    } else {
        req.session.data['error'] = { error: 'No ID found in session data' };
        return res.redirect('/create');
    }
}

exports.g_addexception = async function (req, res) {

    if (!req.session.data) {
        return res.redirect('/create/standard');
    }

    let id = req.session.data['id'];

    if (id) {
        try {
            const standard = await previewClient.getEntry(id);
            return res.render('create/standard/add-exception', { standard });
        } catch (error) {
            console.error("Error fetching standard entry from Contentful:", error);
            req.session.data['error'] = { error: 'Failed to fetch standard entry' };
            return res.redirect('/create');
        }
    } else {
        req.session.data['error'] = { error: 'No ID found in session data' };
        return res.redirect('/create');
    }
}


exports.g_contacts = async function (req, res) {

    if (!req.session.data) {
        return res.redirect('/create/standard');
    }

    let message = req.session.data['success'];

    req.session.data['success'] = "";


    let id = req.session.data['id'];

    if (id) {
        try {
            const standard = await previewClient.getEntry(id);
            return res.render('create/standard/contacts', { standard, message });
        } catch (error) {
            console.error("Error fetching standard entry from Contentful:", error);
            req.session.data['error'] = { error: 'Failed to fetch standard entry' };
            return res.redirect('/create');
        }
    } else {
        req.session.data['error'] = { error: 'No ID found in session data' };
        return res.redirect('/create');
    }
}

exports.g_addcontact = async function (req, res) {

    if (!req.session.data) {
        return res.redirect('/create/standard');
    }

    let id = req.session.data['id'];

    if (id) {
        try {
            const standard = await previewClient.getEntry(id);
            // Get people from contentful

            const response = await client.getEntries({
                content_type: 'person',
                order: 'fields.name',
                select: 'fields.name,fields.emailAddress'
            });

            const people = response.items.map(item => {
                return {
                    text: item.fields.name,
                    value: item.fields.emailAddress
                }
            });

            console.log(people)
            return res.render('create/standard/add-contact', { people, standard })
        } catch (error) {
            console.error("Error fetching standard entry from Contentful:", error);
            req.session.data['error'] = { error: 'Failed to fetch standard entry' };
            return res.redirect('/create');
        }
    } else {
        req.session.data['error'] = { error: 'No ID found in session data' };
        return res.redirect('/create');
    }



}

exports.g_guidance = async function (req, res) {

    if (!req.session.data) {
        return res.redirect('/create/standard');
    }

    let id = req.session.data['id'];

    if (id) {
        try {
            const standard = await previewClient.getEntry(id);
            return res.render('create/standard/guidance', { standard });
        } catch (error) {
            console.error("Error fetching standard entry from Contentful:", error);
            req.session.data['error'] = { error: 'Failed to fetch standard entry' };
            return res.redirect('/create');
        }
    } else {
        req.session.data['error'] = { error: 'No ID found in session data' };
        return res.redirect('/create');
    }
}





// POSTS //

exports.p_title = async function (req, res) {

    // Update the standard entry with any changes to the title

    const { id } = req.session.data;

    const standard = await previewClient.getEntry(id);

    await updateTitle(id, req.body['title']);

    return res.redirect('/create/standard/summary')
}

exports.p_summary = async function (req, res) {

    const { id } = req.session.data;

    const standard = await previewClient.getEntry(id);

    await updateSummary(id, req.body['summary']);

    return res.redirect('/create/standard/categories')
}



exports.p_categories = async function (req, res) {
    try {
        const { id } = req.session.data; // The standard entry ID
        const standard = await previewClient.getEntry(id);

        const selectedCategories = req.body['categories'];

        // From a checkbox list, may be 1 selected or many, so could be a string or array, so convert to array in all cases

        const selectedCategoriesArray = Array.isArray(selectedCategories) ? selectedCategories : [selectedCategories];


        await updateCategories(id, selectedCategoriesArray);


        return res.redirect('/create/standard/sub-categories');
    } catch (error) {
        console.error("Error updating categories:", error);
        return res.status(500).send("Error updating categories");
    }
};

exports.p_subcategories = async function (req, res) {

    const { id } = req.session.data; // The standard entry ID
    const standard = await previewClient.getEntry(id);

    const selectedSubcategories = req.body['subcategories'];

    const selectedSubCategoriesArray = Array.isArray(selectedSubcategories) ? selectedSubcategories : [selectedSubcategories];

    await updateSubCategories(id, selectedSubCategoriesArray);

    // Redirect to the next step in the flow
    return res.redirect('/create/standard/purpose');
};


exports.p_purpose = async function (req, res) {

    const { id } = req.session.data;

    const standard = await previewClient.getEntry(id);

    await updatePurpose(id, req.body['purpose']);

    return res.redirect('/create/standard/guidance')
}





exports.p_addapprovedproduct = async function (req, res) {

    const { id } = req.session.data;

    const {
        approved_name,
        approved_vendor,
        approved_version,
        approved_usecase,
    } = req.body;

    console.log(req.body);


    const newProductEntry = await createApprovedProductEntry(
        approved_name,
        approved_vendor,
        approved_version,
        approved_usecase,
    );

    if (newProductEntry) {
        // Update the standard to link the new product entry
        const updatedStandard = await updateApprovedProductsField(
            id,
            newProductEntry.sys.id,
        );

        return res.redirect("/create/standard/products/");
    }
}


exports.p_addtoleratedproduct = async function (req, res) {


    const { id } = req.session.data;

    const {
        tolerated_name,
        tolerated_vendor,
        tolerated_version,
        tolerated_usecase,
    } = req.body;

    console.log(req.body);


    const newProductEntry = await createToleratedProductEntry(
        tolerated_name,
        tolerated_vendor,
        tolerated_version,
        tolerated_usecase,
    );

    if (newProductEntry) {
        // Update the standard to link the new product entry
        const updatedStandard = await updateToleratedProductsField(
            id,
            newProductEntry.sys.id,
        );

        return res.redirect("/create/standard/products");
    }
}


exports.p_addexception = async function (req, res) {

    const { id } = req.session.data;

    const {
        exception,
        exceptiondetail,
    } = req.body;

    console.log(req.body);


    const newExceptionEntry = await createExceptionEntry(
        exception,
        exceptiondetail
    );

    if (newExceptionEntry) {
        // Update the standard to link the new product entry
        const updatedStandard = await updateExceptionField(
            id,
            newExceptionEntry.sys.id,
        );

        return res.redirect("/create/standard/exceptions");
    }


}

exports.p_addcontact = async function (req, res) {

    // Check if req.session.data.contacts exists, if not, create it
    if (!req.session.data) {
        req.session.data = {};
    }

    const { id } = req.session.data;

    const { contactType, people, contactEmail, contactName } = req.body;

    // Case 1: Use contactEmail and contactName if both are provided
    if (contactEmail && contactName) {

        // Create a contact in Contentful

        try {

            const person = await createPerson(

                contactName, contactEmail
            );

            // Update the standard to link the new person entry

            const updatedStandard = await updateContactField(
                id,
                person.sys.id,
                contactType
            );

            return res.redirect('/create/standard/contacts');

        } catch (error) {
            console.error("Error creating person in Contentful:", error);
            // Handle Contentful API failure
        }

    }

    // Case 2: If contactEmail and contactName are empty, use 'people' to fetch contact details from Contentful
    if (people) {
        try {
            const response = await client.getEntries({
                content_type: 'person',
                'fields.emailAddress': people // Query by email
            });

            const person = response.items[0]; // Get the first result

            if (person) {

                const updatedStandard = await updateContactField(
                    id,
                    person.sys.id,
                    contactType
                );

            }
        } catch (error) {
            console.error("Error fetching person from Contentful:", error);
            // Handle Contentful API failure or person not found
        }
    }

    // Redirect if nothing was added
    return res.redirect('/create/standard/contacts');
};

exports.p_guidance = async function (req, res) {

    const { id } = req.session.data;

    const standard = await previewClient.getEntry(id);

    await updateGuidance(id, req.body['guidance']);

    return res.redirect('/create/standard/products')
}

exports.p_submit = async function (req, res) {

    const { action } = req.body;

    // Check if the session data exists
    if (!req.session.data) {
        return res.redirect('/create/standard');
    }

    // Get the data from the session including from drafts

    const { id } = req.session.data;

    const standard = await previewClient.getEntry(id);

    // current UTC time
    const now = new Date().toISOString();

    if (action === 'Submit') {
        //Get the ID for the stage
        const stage = await client.getEntries({
            content_type: 'stage',
            'fields.number': 20
        });

        const stageId = stage.items[0].sys.id;

        // Update the stage of the standard to 'Draft'

        await updateToDraft(id, stageId, req.session.User.EmailAddress);

        // Render the success view
        return res.render('create/standard/success', { id });

    }

    if (action === 'Delete') {
        return res.redirect('/create/standard/confirm-delete');
    }

}

exports.p_manageApprovedProduct = async function (req, res) {

    const { approvedID, approved_name, approved_vendor, approved_version, approved_usecase, manage } = req.body;
    const { id } = req.session.data;

    console.log(manage)

    if (manage === 'save') {

        // Update the approved product in the standard


        const result = await updateApprovedProduct(approvedID, approved_name, approved_vendor, approved_version, approved_usecase);
        req.session.data['success'] = "Changes saved.";

    }

    if (manage === 'delete') {

        // Delete the approved product from the standard, don't delete the approved product though

        const result = await removeApprovedProductsField(id, approvedID);


        req.session.data['success'] = "Changes saved.";

    }

    return res.redirect('/create/standard/products');
};

exports.p_manageException = async function (req, res) {

    const { exceptionID, exception, exceptiondetail, manage } = req.body;
    const { id } = req.session.data;

    console.log(manage)

    if (manage === 'save') {

        // Update the exception in the standard
        const result = await updateException(exceptionID, exception, exceptiondetail);
        req.session.data['success'] = "Changes saved.";
    }

    if (manage === 'delete') {

        // Delete the exception from the standard, don't delete the exception though
        const result = await removeExceptionField(id, exceptionID);

    }

    return res.redirect('/create/standard/exceptions');

};

exports.p_manageContact = async function (req, res) {

    const { contactID, contactType, manage, previousRole } = req.body;
    const { id } = req.session.data;

    console.log(manage)

    if (manage === 'delete') {
        // Delete the contact from the standard, don't delete the contact though
        const result = await removeContactField(id, contactID, previousRole);
        req.session.data['success'] = "Changes saved.";
    }

    if (manage === 'save') {
        // Update the contact in the standard
        const result = await updateContactField(id, contactID, contactType);
        req.session.data['success'] = "Changes saved.";
    }

    return res.redirect('/create/standard/contacts');
}

exports.p_confirmdelete = async function (req, res) {

    const { action } = req.body;

        const { id } = req.session.data;

        // Delete the standard from Contentful
        const response = await deleteEntry(id);

        // Redirect to the create page

        return res.redirect('/create/standard/deleted');

}

