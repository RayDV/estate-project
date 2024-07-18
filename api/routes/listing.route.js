import express from 'express';
import { createListing, deleteListing, updateListing, getListing } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);
// We don't have to verify a user to get a listing since listings can be accessed publicly
router.get('/get/:id', getListing);

export default router;