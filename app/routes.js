const express = require('express')
const router = express.Router()

// Controllers
const homeController = require('./controllers/homeController.js');
const createController = require('./controllers/createStandardController.js');
const manageController = require('./controllers/manageStandardController.js');
const previewController = require('./controllers/previewController.js');
const adminController = require('./controllers/adminController.js');


// Home route
router.get("/", homeController.g_home);


// Create routes for standard owners/drafters
router.get('/create/standard', createController.g_standard_tasks);
router.get('/create/standard/title', createController.g_title);
router.get('/create/standard/categories', createController.g_categories);
router.get('/create/standard/sub-categories', createController.g_subcategories);
router.get('/create/standard/purpose', createController.g_purpose);
router.get('/create/standard/products', createController.g_products);
router.get('/create/standard/add-approved-product', createController.g_addapprovedproduct);
router.get('/create/standard/add-tolerated-product', createController.g_addtoleratedproduct);
router.get('/create/standard/remove-approved-product/:id', createController.g_removeapprovedproduct);
router.get('/create/standard/remove-tolerated-product/:id', createController.g_removeatoleratedproduct);
router.get('/create/standard/exceptions', createController.g_exceptions);
router.get('/create/standard/contacts', createController.g_contacts);
router.get('/create/standard/add-contact', createController.g_addcontact);

router.post('/create/standard/title', createController.p_title);
router.post('/create/standard/categories', createController.p_categories);
router.post('/create/standard/sub-categories', createController.p_subcategories);
router.post('/create/standard/add-exception', createController.p_addexception);
router.post('/create/standard/add-approved-product', createController.p_addapprovedproduct);
router.post('/create/standard/purpose', createController.p_purpose);
router.post('/create/standard/add-tolerated-product', createController.p_addtoleratedproduct);
router.post('/create/standard/add-contact', createController.p_addcontact);
router.get('/create/standard/guidance', createController.g_guidance);
router.post('/create/standard/guidance', createController.p_guidance);
router.post('/create/standard/submit', createController.p_submit);


// Manage routes for standard owners/drafters
router.get('/manage', manageController.g_dashboard);
router.get('/manage/standard/:id', manageController.g_manage);
router.get('/manage/standard/purpose/:id', manageController.g_manage_purpose);
router.get('/manage/standard/guidance/:id', manageController.g_manage_guidance);
router.get('/manage/standard/considerations/:id', manageController.g_manage_considerations);
router.get('/manage/standard/templates/:id', manageController.g_manage_templates);
router.get('/manage/standard/products/:id', manageController.g_manage_products);
router.get('/manage/standard/add-approved-product/:id', manageController.g_manage_addapprovedproducts);
router.get('/manage/standard/add-tolerated-product/:id', manageController.g_manage_addtoleratedproducts);
router.get('/manage/standard/exceptions/:id', manageController.g_manage_exceptions);
router.get('/manage/standard/contacts/:id', manageController.g_manage_contacts);
router.get('/manage/standard/add-contact/:id', manageController.g_manage_addcontact);
router.get('/manage/standard/remove-owner-contact/:standardid/:id', manageController.g_manage_removeownercontact);
router.get('/manage/standard/remove-technical-contact/:standardid/:id', manageController.g_manage_removetechnicalcontact);
router.get('/manage/standard/remove-approved-product/:standardid/:id', manageController.g_manage_removeapprovedproduct);
router.get('/manage/standard/add-exception/:id', manageController.g_manage_addexception);
router.get('/manage/standard/manage-exception/:id/:exceptionid', manageController.g_manage_manageexception)
router.get('/manage/standard/moveto/review/:id', manageController.g_manage_movetoreview);
router.get('/manage/standard/index2/:id', manageController.g_manage_index2);

router.post('/manage/standard/purpose', manageController.p_manage_purpose);
router.post('/manage/standard/guidance', manageController.p_manage_guidance);
router.post('/manage/standard/considerations', manageController.p_manage_considerations);
router.post('/manage/standard/templates', manageController.p_manage_templates);
router.post('/manage/standard/add-exception', manageController.p_manage_addexception);
router.post('/manage/standard/manage-exception', manageController.p_manage_manageexception);
router.post('/manage/standard/add-contact', manageController.p_manage_addcontact);
router.post('/manage/standard/add-approved-product', manageController.p_manage_addapprovedproduct);
router.post('/manage/standard/move-stage', manageController.p_manage_movestage);


// Preview routes
router.get('/preview/:id', previewController.g_standard);
router.get('/preview/how/:id', previewController.g_preview_how);
router.get('/preview/considerations/:id', previewController.g_preview_considerations);
router.get('/preview/templates/:id', previewController.g_preview_templates);
router.get('/preview/products/:id', previewController.g_preview_products);
router.get('/preview/exceptions/:id', previewController.g_preview_exceptions);


// Admin routes for standard board stuff
router.get('/admin', adminController.g_dashboard);
router.get('/admin/standard/:id', adminController.g_manage);
router.get('/admin/standard/approve/:id', adminController.g_approve);
router.get('/admin/standard/reject/:id', adminController.g_reject);
router.get('/admin/standard/approved/:id', adminController.g_approved);
router.get('/admin/standard/rejected/:id', adminController.g_rejected);

router.post('/admin/standard/approval', adminController.p_approval);
router.post('/admin/standard/approve', adminController.p_approve);
router.post('/admin/standard/reject', adminController.p_reject);

module.exports = router