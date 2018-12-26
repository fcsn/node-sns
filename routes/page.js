const express = require('express');

const router = express.Router();

router.get('/profile', (req, res) => {
    res.render('profile', { title: '내 정보 - NodeSns', user: null })
});

router.get('/join', (req, res, next) => {
    res.render('main', {
        title: 'NodeSns',
        twits: [],
        user: null,
        loginError: req.flash('loginError')
    })
})

module.exports = router;
