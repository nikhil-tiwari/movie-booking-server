const express = require('express');
const { handleGetTheatre, handleGetTheatreByName, handleCreateTheatre, handleUpdateTheatre, handleDeleteTheatre, handleAddMovieForListing } = require('../controllers/theatre')
const { ensureAuthentication } = require('../middlewares/auth')

const router = express.Router();

router.get('/', handleGetTheatre);
router.get('/:name', handleGetTheatreByName);
router.post('/create', ensureAuthentication(['admin']), handleCreateTheatre);
router.post('/addMovie/:movieID', handleAddMovieForListing);
router.put('/update/:id', ensureAuthentication(['admin']), handleUpdateTheatre);
router.delete('/delete/:id', ensureAuthentication(['admin']), handleDeleteTheatre);

module.exports = router;