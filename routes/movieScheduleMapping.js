const express = require('express');
const { handleGetMovieSchedule, handleCreateMovieSchedule, handleUpdateMovieSchedule, handleDeleteMovieSchedule } = require('../controllers/movieScheduleMapping');
const { ensureAuthentication } = require('../middlewares/auth');

const router = express.Router();

router.get('/', handleGetMovieSchedule);
router.post('/create', ensureAuthentication(['admin']), handleCreateMovieSchedule);
router.put('/update/:id', ensureAuthentication(['admin']), handleUpdateMovieSchedule);
router.delete('/delete/:id', ensureAuthentication(['admin']), handleDeleteMovieSchedule);

module.exports = router;