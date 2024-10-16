require('dotenv').config();
const client  = require('../../middleware/contentful.js');
const previewClient = require('../../middleware/contentful-preview.js');
const managementClient = require('../../middleware/contentful-management.js');

const createStandardEntry = require('../../middleware/standards.js');

const { slugify } = require('../../middleware/tools.js');

function generateRandomId() {
    return Math.random().toString(36).substr(2, 9); // Generates a random string
}

// GETS //

exports.g_standard_tasks = async function (req, res) {

    // If we have session data and categories and subcategories then get the data to use in the view

    if (req.session.data && req.session.data['categories'] && req.session.data['subcategories']) {

        const cats = req.session.data['categories'];
        const subcats = req.session.data['subcategories'];


        const categoryNumbers = Array.isArray(cats) ? cats : [cats];
        const subCategoryNumbers = Array.isArray(subcats) ? subcats : [subcats];

        // Step 1: Get Categories for the selected Category Numbers

        const categoryResponse = await client.getEntries({
            content_type: 'category',
            select: 'fields.title,fields.number',
            'fields.number[in]': categoryNumbers
        });

        const categories = categoryResponse.items.map(item => {
            return {
                text: item.fields.title,
                value: item.fields.number
            }
        });

        // Need the ID of the category, to also pass in the subcategory query

        const categoryIds = categoryResponse.items.map(item => item.sys.id);

        // Step 2: Get the subcategories for the selected subcategory numbers
        const subcategoryResponse = await client.getEntries({
            content_type: 'subCategory',
            order: 'fields.title',
            select: 'fields.title,fields.number',
            'fields.active': true,
            'fields.number[in]': subCategoryNumbers,
            'fields.category.sys.id[in]': categoryIds,  // Filter subcategories by category IDs
        });

        // Map the results to build the subcategories list but group by category

        const subcategories = subcategoryResponse.items.map(item => {
            return {
                text: item.fields.title,
                value: item.fields.number
            }
        });



        // Render the index view
        return res.render('create/standard/index', { categories, subcategories });

    }

    return res.render('create/standard/index');
}








exports.g_title = async function (req, res) {
    return res.render('create/standard/title')
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
            value: item.fields.number
        }
    });

    return res.render('create/standard/categories', { categories })
}


exports.g_subcategories = async function (req, res) {
    // Ensure session data exists
    if (!req.session.data) {
        return res.redirect('/create/standard');
    }

    const selectedCategories = req.session.data['categories'];
    const categoryNumbers = Array.isArray(selectedCategories) ? selectedCategories : [selectedCategories];

    // Step 1: Get Category IDs for the selected Category Numbers
    const categoryResponse = await client.getEntries({
        content_type: 'category',
        select: 'sys.id,fields.number,fields.title',
        'fields.number[in]': categoryNumbers
    });

    // Create a map to hold category information
    const categoryMap = categoryResponse.items.reduce((map, category) => {
        map[category.sys.id] = {
            id: category.sys.id,
            number: category.fields.number,
            title: category.fields.title,
            subcategories: []
        };
        return map;
    }, {});

    const categoryIds = Object.keys(categoryMap);

    // Step 2: Get subcategories for the selected category IDs
    const subcategoryResponse = await client.getEntries({
        content_type: 'subCategory',
        order: 'fields.title',
        select: 'fields.title,fields.number,fields.category',
        'fields.active': true,
        'fields.category.sys.id[in]': categoryIds, // Filter subcategories by category IDs
    });

    // Group subcategories by their parent categories
    subcategoryResponse.items.forEach(item => {
        const parentCategoryId = item.fields.category[0].sys.id; // Assumes each subcategory has one parent category
        if (categoryMap[parentCategoryId]) {
            categoryMap[parentCategoryId].subcategories.push({
                text: item.fields.title,
                value: item.fields.number
            });
        }
    });

    // Convert categoryMap to an array to pass to the view
    const categories = Object.values(categoryMap);

    // Render the view and pass the categories with grouped subcategories
    return res.render('create/standard/sub-categories', { categories });
};



exports.g_purpose = async function (req, res) {
    return res.render('create/standard/purpose')
}

exports.g_products = async function (req, res) {

    if (!req.session.data) {
        return res.redirect('/create/standard');
    }
    const approvedProducts = req.session.data.approvedProducts || [];
    const toleratedProducts = req.session.data.toleratedProducts || [];


    return res.render('create/standard/products', { approvedProducts: approvedProducts, toleratedProducts: toleratedProducts })

}


exports.g_addapprovedproduct = async function (req, res) {

    if (!req.session.data) {
        return res.redirect('/create/standard');
    }
    return res.render('create/standard/add-approved-product')

}

exports.g_addtoleratedproduct = async function (req, res) {

    if (!req.session.data) {
        return res.redirect('/create/standard');
    }
    return res.render('create/standard/add-tolerated-product')

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
    const exceptions = req.session.data.exceptions || [];


    return res.render('create/standard/exceptions', { exceptions })

}

exports.g_contacts = async function (req, res) {

    if (!req.session.data) {
        return res.redirect('/create/standard');
    }
    const contacts = req.session.data.contacts || [];

    console.log(contacts)

    return res.render('create/standard/contacts', { contacts })
}

exports.g_addcontact = async function (req, res) {

    if (!req.session.data) {
        return res.redirect('/create/standard');
    }
    const contacts = req.session.data.contacts || [];

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
    }    );

    console.log(people)
    return res.render('create/standard/add-contact', { people })
}

exports.g_guidance = async function (req, res) {

    if (!req.session.data) {
        return res.redirect('/create/standard');
    }


    return res.render('create/standard/guidance')

}


// POSTS //

exports.p_title = async function (req, res) {

    if (!req.session.data) {
        req.session.data = {};
    }

    req.session.data['1_standard'] = true;

    req.session.data['title'] = req.body['title']; console.log(req.session)

    return res.redirect('/create/standard/categories')
}

exports.p_categories = async function (req, res) {

    req.session.data['categories'] = req.body['categories'];

    console.log(req.session)

    return res.redirect('/create/standard/sub-categories')
}

exports.p_subcategories = async function (req, res) {
    // The submitted data will contain subcategories grouped by category
    const selectedSubcategories = req.body['subcategories']; // This will be an object like { '1': ['101', '102'], '2': ['201'] }

    // Store the selected subcategories and their corresponding categories in the session
    req.session.data['subcategories'] = selectedSubcategories;

    // Logging the session for debugging purposes
    console.log("Session data after subcategory selection:", req.session.data);

    // Redirect to the next step in the flow
    return res.redirect('/create/standard/purpose');
};


exports.p_purpose = async function (req, res) {
    req.session.data['purpose'] = req.body['purpose'];

    console.log(req.session)
    return res.redirect('/create/standard')
}


exports.p_addapprovedproduct = async function (req, res) {
    // Check if the session data exists
    if (!req.session.data) {
        req.session.data = {};
    }

    // Initialize approved products array if it doesn't exist
    if (!req.session.data.approvedProducts) {
        req.session.data.approvedProducts = [];
    }

    // Get the submitted data from the request body
    const approvedProduct = {
        id: generateRandomId(),
        name: req.body['approved-name'],
        vendor: req.body['approved-vendor'],
        version: req.body['approved-version'],
        usecase: req.body['approved-usecase'],
    };

    // Push the new approved product to the session array
    req.session.data.approvedProducts.push(approvedProduct);

    console.log(req.session.data.approvedProducts); // For debugging

    // Redirect to the next page or back to the products page
    return res.redirect('/create/standard/products');
}


exports.p_addtoleratedproduct = async function (req, res) {
    // Check if the session data exists
    if (!req.session.data) {
        req.session.data = {};
    }

    // Initialize approved products array if it doesn't exist
    if (!req.session.data.toleratedProducts) {
        req.session.data.toleratedProducts = [];
    }

    // Get the submitted data from the request body
    const toleratedProduct = {
        id: generateRandomId(),
        name: req.body['tolerated-name'],
        vendor: req.body['tolerated-vendor'],
        version: req.body['tolerated-version'],
        usecase: req.body['tolerated-usecase'],
    };

    // Push the new tolerated product to the session array
    req.session.data.toleratedProducts.push(toleratedProduct);

    console.log(req.session.data.toleratedProducts); // For debugging

    // Redirect to the next page or back to the products page
    return res.redirect('/create/standard/products');
}

exports.p_addexception = async function (req, res) {
    // Check if the session data exists
    if (!req.session.data) {
        req.session.data = {};
    }

    // Initialize approved products array if it doesn't exist
    if (!req.session.data.exceptions) {
        req.session.data.exceptions = [];
    }

    // Get the submitted data from the request body
    const exception = {
        id: generateRandomId(),
        exception: req.body['exception'],
        exceptiondetail: req.body['exceptiondetail']
    };

    // Push the new tolerated product to the session array
    req.session.data.exceptions.push(exception);

    console.log(req.session.data.exceptions); // For debugging

    // Redirect to the next page or back to the products page
    return res.redirect('/create/standard/exceptions');
}

exports.p_addcontact = async function (req, res) {

    // Check if req.session.data.contacts exists, if not, create it
    if (!req.session.data) {
        req.session.data = {};
    }

    if (!req.session.data.contacts) {
        req.session.data.contacts = [];
    }

    const { contactType, people, contactEmail, contactName } = req.body;

    // Case 1: Use contactEmail and contactName if both are provided
    if (contactEmail && contactName) {
        const contact = {
            id: generateRandomId(),
            contactType: contactType,
            contactEmail: contactEmail,
            contactName: contactName
        };

        // Check if the same contactType and contactEmail already exist
        const existingContact = req.session.data.contacts.find(c =>
            c.contactType === contactType && c.contactEmail === contactEmail
        );

        if (existingContact) {
            return res.redirect('/create/standard/contacts'); // Don't add duplicate
        }

        // Add the new contact
        req.session.data.contacts.push(contact);
        return res.redirect('/create/standard/contacts');
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
                const contact = {
                    id: generateRandomId(),
                    contactType: contactType,
                    contactEmail: person.fields.emailAddress,
                    contactName: person.fields.name
                };

                // Check if the same contactType and contactEmail already exist
                const existingContact = req.session.data.contacts.find(c =>
                    c.contactType === contactType && c.contactEmail === person.fields.emailAddress
                );

                if (existingContact) {
                    return res.redirect('/create/standard/contacts'); // Don't add duplicate
                }

                // Add the new contact
                req.session.data.contacts.push(contact);
                return res.redirect('/create/standard/contacts');
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
    // Check if the session data exists
    if (!req.session.data) {
        req.session.data = {};
    }

    // Initialize approved products array if it doesn't exist
    if (!req.session.data.guidance) {
        req.session.data.guidance = "";
    }

    const { guidance } = req.body;

    // Store the guidance in the session    
    req.session.data.guidance = guidance;


    // Redirect to the next page or back to the products page
    return res.redirect('/create/standard/guidance');
}


exports.p_submit = async function (req, res) {

    // Check if the session data exists
    if (!req.session.data) {
        return res.redirect('/create/standard');
    }

    // Get the data from the session including from drafts

    const entries = await previewClient.getEntries({
        content_type: 'standard',
        order: '-fields.number',
        limit: 1,
        include: 1
    });

    let nextNumber = 1;

    console.log('Last entry:', entries);

    if (entries.items.length !== 0) {
        // For the given entry, get the number and increment it by 1

        const lastEntry = entries.items[0];
        const lastNumber = lastEntry.fields.number;
        nextNumber = lastNumber + 1;
    }


    //Get the ID for the stage
    const stage = await client.getEntries({
        content_type: 'stage',
        'fields.number': 20
    });

    const stageId = stage.items[0].sys.id;


    // Get the entries in contacts and pass to owners and technicalContacts

    const owners = req.session.data.contacts.filter(contact => contact.contactType === 'Owner').map(contact => contact.contactEmail);
    const technicalContacts = req.session.data.contacts.filter(contact => contact.contactType === 'Technical contact').map(contact => contact.contactEmail);

    // Get the ID's of the email addresses for the owners

    const ownerEntries = await client.getEntries({
        content_type: 'person',
        'fields.emailAddress[in]': owners
    });

    const ownerIds = ownerEntries.items.map(item => item.sys.id);

    // Get the ID's of the email addresses for the technical contacts

    const technicalContactEntries = await client.getEntries({
        content_type: 'person',
        'fields.emailAddress[in]': technicalContacts
    });

    const technicalContactIds = technicalContactEntries.items.map(item => item.sys.id);

    console.log(technicalContactIds);

    // Get the categoryId and subcategoryId

    const selectedCategories = req.session.data['categories'];
    const selectedSubcategories = req.session.data['subcategories'];

    const categoryNumbers = Array.isArray(selectedCategories) ? selectedCategories : [selectedCategories];
    const subCategoryNumbers = Array.isArray(selectedSubcategories) ? selectedSubcategories : [selectedSubcategories];

    // GET ID's for the categories

    const categoryResponse = await client.getEntries({
        content_type: 'category',
        'fields.number[in]': categoryNumbers
    });

    const categoryIds = categoryResponse.items.map(item => item.sys.id);

    // GET ID's for the subcategories

    const subcategoryResponse = await client.getEntries({
        content_type: 'subCategory',
        'fields.number[in]': subCategoryNumbers
    });

    const subcategoryIds = subcategoryResponse.items.map(item => item.sys.id);


    
    const standardID = await createStandardEntry({
        title: req.session.data['title'],
        stageId: stageId,
        number: nextNumber,
        summary: '',
        slug: slugify(req.session.data['title']),
        version: 0.1,
        previousVersion: 0,
        owners: ownerIds,
        technicalContacts: technicalContactIds,
        purpose: req.session.data['purpose'],
        compliance: req.session.data['guidance'],
        category: categoryIds,
        subCategory: subcategoryIds
    });



    // Render the success view
    return res.render('create/standard/success', { standardID });


}

