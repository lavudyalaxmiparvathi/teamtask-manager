const express = require('express');
const {
    getTeamMembers,
    addMember,
    deleteMember
} = require('../controllers/teamController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
    .route('/')
    .get(getTeamMembers)
    .post(authorize('Admin'), addMember);

router
    .route('/:id')
    .delete(authorize('Admin'), deleteMember);

module.exports = router;
