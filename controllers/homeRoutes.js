const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');
const sequelize = require('../config/connection');
const { QueryTypes } = require('sequelize');


router.get('/', async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Comment,
        },
      ],
    });

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));
    posts.forEach(post => {
      if(post.contents.length > 450){
        post.contents = post.contents.slice(0,450) + ' ...'
      }
    });
    // Pass serialized data and session flag into template
    res.render('homepage', { 
      posts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
// render specific post
router.get('/post/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
        },
        {
          model: Comment,
        },
      ],
    });

    const post = postData.get({ plain: true });
    res.render('post', {
      ...post,
      logged_in: req.session.logged_in,
      logged_id: req.session.user_id
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
// render personal user dashboard
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }, { model: Comment }],
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
// login
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard'); // route to personal dash if logged in
    return;
  }

  res.render('login');
});
// render page that allows the post to be updated.
router.get('/post/update/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Comment,
        },
      ],
    });

    const post = postData.get({ plain: true });
    res.render('update', {
      ...post,
      logged_in: req.session.logged_in,
      logged_id: req.session.user_id
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
