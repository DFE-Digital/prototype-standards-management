const express = require('express')
const router = express.Router()

// Controllers
const authController = require('./controllers/authController.js');
const homeController = require('./controllers/homeController.js');
const createController = require('./controllers/createStandardController.js');
const manageController = require('./controllers/manageStandardController.js');
const previewController = require('./controllers/previewController.js');
const adminController = require('./controllers/adminController.js');
const profileController = require('./controllers/profileController');
const standardsController = require('./controllers/standardsController.js');


function isAuthenticated(req, res, next) {
    if (req.session && req.session.UserId && req.session.User) {
        return next();
    } else {
        req.session.originalUrl = req.originalUrl;
        return res.redirect('/sign-in');
    }
}


router.get('/sign-in', authController.g_signin);
router.get('/auth/t/:token', authController.g_checktoken);
router.get('/auth/sign-out', authController.g_signout);
router.get('/check-email', authController.g_checkemail);
router.post('/sign-in', authController.p_signin);

// Home route
router.get("/", manageController.g_dashboard);


// Create routes for standard owners/drafters
router.get('/create', isAuthenticated, createController.g_create);
router.get('/create/standard/create', isAuthenticated, createController.g_standardcreate);
router.get('/create/standard', isAuthenticated, createController.g_standard_tasks);
router.get('/create/getdraft/:id', isAuthenticated, createController.g_standard_getdraft);
router.get('/create/standard/title', isAuthenticated, createController.g_title);
router.get('/create/standard/summary', isAuthenticated, createController.g_summary);
router.get('/create/standard/categories', isAuthenticated, createController.g_categories);
router.get('/create/standard/sub-categories', isAuthenticated, createController.g_subcategories);
router.get('/create/standard/purpose', isAuthenticated, createController.g_purpose);
router.get('/create/standard/products', isAuthenticated, createController.g_products);
router.get('/create/standard/add-approved-product', isAuthenticated, createController.g_addapprovedproduct);
router.get('/create/standard/manage-approved-product/:productid', createController.g_manageapprovedproduct);
router.get('/create/standard/manage-contact/:contactid', isAuthenticated, createController.g_managecontact);
router.get('/create/standard/add-tolerated-product', isAuthenticated, createController.g_addtoleratedproduct);
router.get('/create/standard/remove-approved-product/:id', isAuthenticated, createController.g_removeapprovedproduct);
router.get('/create/standard/remove-tolerated-product/:id', isAuthenticated, createController.g_removeatoleratedproduct);
router.get('/create/standard/exceptions', isAuthenticated, createController.g_exceptions);
router.get('/create/standard/add-exception', isAuthenticated, createController.g_addexception);
router.get('/create/standard/manage-exception/:exceptionid', createController.g_manageexception);
router.get('/create/standard/contacts', isAuthenticated, createController.g_contacts);
router.get('/create/standard/add-contact', isAuthenticated, createController.g_addcontact);
router.get('/create/standard/success', isAuthenticated, createController.g_success);
router.get('/create/standard/confirm-delete', isAuthenticated, createController.g_confirmdelete);
router.get('/create/standard/deleted', isAuthenticated, createController.g_deleted);
router.get('/create/standard/preview', isAuthenticated, createController.g_preview);
router.get('/create/standard/preview-meet', isAuthenticated, createController.g_previewmeet);
router.get('/create/standard/preview-products', isAuthenticated, createController.g_previewproducts);
router.get('/create/standard/guidance', isAuthenticated, createController.g_guidance);

router.post('/create/standard/title', isAuthenticated, createController.p_title);
router.post('/create/standard/summary', isAuthenticated, createController.p_summary);
router.post('/create/standard/categories', isAuthenticated, createController.p_categories);
router.post('/create/standard/sub-categories', isAuthenticated, createController.p_subcategories);
router.post('/create/standard/add-exception', isAuthenticated, createController.p_addexception);
router.post('/create/standard/add-approved-product', isAuthenticated, createController.p_addapprovedproduct);
router.post('/create/standard/manage-approved-product', isAuthenticated, createController.p_manageApprovedProduct);
router.post('/create/standard/manage-exception', isAuthenticated, createController.p_manageException);
router.post('/create/standard/manage-contact', isAuthenticated, createController.p_manageContact);
router.post('/create/standard/purpose', isAuthenticated, createController.p_purpose);
router.post('/create/standard/contacts', isAuthenticated, createController.p_contacts);
router.post('/create/standard/add-tolerated-product', isAuthenticated, createController.p_addtoleratedproduct);
router.post('/create/standard/add-contact', isAuthenticated, createController.p_addcontact);
router.post('/create/standard/guidance', isAuthenticated, createController.p_guidance);
router.post('/create/standard/submit', isAuthenticated, createController.p_submit);
router.post('/create/standard/confirm-delete', isAuthenticated, createController.p_confirmdelete);

// Manage routes for standard owners/drafters
router.get('/manage', isAuthenticated, manageController.g_dashboard);

router.get('/manage/getstandard/:id', isAuthenticated, manageController.g_standard_getdraft);
router.get('/manage/standard', isAuthenticated, manageController.g_manage);

router.get('/manage/standard/:id', isAuthenticated, manageController.g_manage);
router.get('/manage/standard/title', isAuthenticated, manageController.g_manage_title);
router.get('/manage/standard/purpose/:id', isAuthenticated, manageController.g_manage_purpose);
router.get('/manage/standard/guidance/:id', isAuthenticated, manageController.g_manage_guidance);
router.get('/manage/standard/considerations/:id', isAuthenticated, manageController.g_manage_considerations);
router.get('/manage/standard/templates/:id', isAuthenticated, manageController.g_manage_templates);
router.get('/manage/standard/products/:id', isAuthenticated, manageController.g_manage_products);
router.get('/manage/standard/add-approved-product/:id', isAuthenticated, manageController.g_manage_addapprovedproducts);
router.get('/manage/standard/add-tolerated-product/:id', isAuthenticated, manageController.g_manage_addtoleratedproducts);
router.get('/manage/standard/exceptions/:id', isAuthenticated, manageController.g_manage_exceptions);
router.get('/manage/standard/contacts/:id', isAuthenticated, manageController.g_manage_contacts);
router.get('/manage/standard/add-contact/:id', isAuthenticated, manageController.g_manage_addcontact);
router.get('/manage/standard/remove-owner-contact/:standardid/:id', isAuthenticated, manageController.g_manage_removeownercontact);
router.get('/manage/standard/remove-technical-contact/:standardid/:id', isAuthenticated, manageController.g_manage_removetechnicalcontact);
router.get('/manage/standard/remove-approved-product/:standardid/:id', isAuthenticated, manageController.g_manage_removeapprovedproduct);
router.get('/manage/standard/add-exception/:id', isAuthenticated, manageController.g_manage_addexception);
router.get('/manage/standard/manage-exception/:id/:exceptionid', isAuthenticated, manageController.g_manage_manageexception)
router.get('/manage/standard/moveto/review/:id', isAuthenticated, manageController.g_manage_movetoreview);
router.get('/manage/standard/index2/:id', isAuthenticated, manageController.g_manage_index2);
router.get('/manage/standard/preview/:id', isAuthenticated, manageController.g_preview);
router.get('/manage/standard/preview-meet/:id', isAuthenticated, manageController.g_previewmeet);
router.get('/manage/standard/preview-products/:id', isAuthenticated, manageController.g_previewproducts);
router.get('/manage/standard/published/:id', isAuthenticated, manageController.g_published);
router.get('/manage/standard/reverted/:id', isAuthenticated, manageController.g_reverted);
router.get('/manage/standard/history/:id', isAuthenticated, manageController.g_history);
router.get('/manage/:id', isAuthenticated, manageController.g_dashboard);

router.post('/manage/standard/purpose', isAuthenticated, manageController.p_manage_purpose);
router.post('/manage/standard/guidance', isAuthenticated, manageController.p_manage_guidance);
router.post('/manage/standard/considerations', isAuthenticated, manageController.p_manage_considerations);
router.post('/manage/standard/templates', isAuthenticated, manageController.p_manage_templates);
router.post('/manage/standard/add-exception', isAuthenticated, manageController.p_manage_addexception);
router.post('/manage/standard/manage-exception', isAuthenticated, manageController.p_manage_manageexception);
router.post('/manage/standard/add-contact', isAuthenticated, manageController.p_manage_addcontact);
router.post('/manage/standard/add-approved-product', isAuthenticated, manageController.p_manage_addapprovedproduct);
router.post('/manage/standard/move-stage', isAuthenticated, manageController.p_manage_movestage);
router.post('/manage/standard/publish', isAuthenticated, manageController.p_publish);



// Preview routes
router.get('/preview/:id', isAuthenticated, previewController.g_standard);
router.get('/preview/how/:id', isAuthenticated, previewController.g_preview_how);
router.get('/preview/considerations/:id', isAuthenticated, previewController.g_preview_considerations);
router.get('/preview/templates/:id', isAuthenticated, previewController.g_preview_templates);
router.get('/preview/products/:id', isAuthenticated, previewController.g_preview_products);
router.get('/preview/exceptions/:id', isAuthenticated, previewController.g_preview_exceptions);


// Admin routes for standard board stuff
router.get('/admin', isAuthenticated, adminController.g_dashboard);
router.get('/admin/standard/outcome-approved/:id', isAuthenticated, adminController.g_outcomeapproved);
router.get('/admin/standard/outcome-rejected/:id', isAuthenticated, adminController.g_outcomerejected);
router.get('/admin/standard/approve/:id', isAuthenticated, adminController.g_approve);
router.get('/admin/standard/task/outcome/:id', isAuthenticated, adminController.g_outcome);
router.get('/admin/standard/reject/:id', isAuthenticated, adminController.g_reject);
router.get('/admin/standard/approved/:id', isAuthenticated, adminController.g_approved);
router.get('/admin/standard/rejected/:id', isAuthenticated, adminController.g_rejected);
router.get('/admin/standard/preview/:id', isAuthenticated, adminController.g_preview);
router.get('/admin/standard/preview-meet/:id', isAuthenticated, adminController.g_previewmeet);
router.get('/admin/standard/preview-products/:id', isAuthenticated, adminController.g_previewproducts);
router.get('/admin/admins', isAuthenticated, adminController.g_admins);
router.get('/admin/:id', isAuthenticated, adminController.g_dashboard);
router.get('/admin/standard/:id', isAuthenticated, adminController.g_manage);

router.post('/admin/standard/outcome', isAuthenticated, adminController.p_outcome);
router.post('/admin/standard/publish', isAuthenticated, adminController.p_publish);


// Standards routes

router.get('/standards', isAuthenticated, standardsController.g_dashboard);
router.get('/standards/view/:id', isAuthenticated, standardsController.g_preview);
router.get('/standards/view/meet/:id', isAuthenticated, standardsController.g_previewmeet);
router.get('/standards/view/products/:id', isAuthenticated, standardsController.g_previewproducts);

// PROFILE ROUTES
router.get('/profile', isAuthenticated, profileController.g_profile);
router.get('/profile/change-name', isAuthenticated, profileController.g_changeName);
router.get('/profile/change-email', isAuthenticated, profileController.g_changeEmail);
router.post('/profile/change-name', isAuthenticated, profileController.p_changeName);
router.post('/profile/change-email', isAuthenticated, profileController.p_changeEmail);




module.exports = router