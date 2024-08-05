const express = require('express');
const { handleGetMovie, handleGetMovieByName, handleCreateMovie, handleUpdateMovie, handleDeleteMovie } = require('../controllers/movie')
const { ensureAuthentication } = require('../middlewares/auth')

const router = express.Router();

router.get('/', handleGetMovie);
router.get('/:name', handleGetMovieByName);
router.post('/create', ensureAuthentication(['admin']), handleCreateMovie);
router.put('/update/:id', ensureAuthentication(['admin']), handleUpdateMovie);
router.delete('/delete/:id', ensureAuthentication(['admin']), handleDeleteMovie);

module.exports = router;