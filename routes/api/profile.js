const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');
const passport = require('passport');

// Load Validation
const validateProfileInput = require('../../validation/profile');
const validateExerienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// Load profile Model
const Profile = require('../../models/Profile');
// Load user profile
const user = require('../../models/User');

// @routes  GET api/profile
// @desc    Get current user profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id })
  .populate('user', ['name', 'avatar'])
    .then(profile => {
      if(!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @routes  GET api/profile/handle/:handle
// @desc    GET profile by handle
// @access  Public

router.get('/handle/:handle', (req, res) => {
  const errors = {}
  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if(!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @routes  GET api/profile/user/:user_id
// @desc    GET profile by user ID
// @access  Public

router.get('/user/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if(!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json({profile: 'There is no profile for this user'});
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @routes  GET api/profile/all
// @desc    GET profiles
// @access  Public
router.get('/all', (req, res) => {
  const errors = {};

  Profile.find()
  .populate('user', ['name', 'avatar'])
  .then(profiles => {
    if(!profiles) {
      errors.noprofile = 'There are no profiles';
      return res.status(404).json(errors);
    }

    res.json(profiles);
  })
  .catch(err => res.status(404).json({ profile: 'There are no profiles'}));
})

// @routes  GET api/profile
// @desc    Create or edit user profile
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is required')
        .not()
        .isEmpty()
    ]
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  }
);

// @routes  GET api/profile/experience
// @desc    ADD experience to profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', { session: false}), (req, res) => {
  const { errors, isValid } = validateExerienceInput(req.body);

  //Check Validation
  if(!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }
    
  Profile.findOne({ user: req.user.id })
  .then(profile => {
    const newExp = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    }

    // Add to experience array
    profile.experience.unshift(newExp);

    profile.save().then(profile => res.json(profile));
  })
});

// @routes  GET api/profile/education
// @desc    ADD education to profile
// @access  Private
router.post('/education', passport.authenticate('jwt', { session: false}), (req, res) => {
  const { errors, isValid } = validateEducationInput(req.body);

  //Check Validation
  if(!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }
    
  Profile.findOne({ user: req.user.id })
  .then(profile => {
    const newEdu = {
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    }

    // Add to experience array
    profile.education.unshift(newEdu);

    profile.save().then(profile => res.json(profile));
  })
});

// @routes  DELETE api/profile/experience/:id
// @desc    DELETE experience from profile
// @access  Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false}), 
(req, res) => {
    
  Profile.findOne({ user: req.user.id }).then(profile => {
    // Get remove index
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    // Splice out of array
    profile.experience.splice(removeIndex);

    // Save
    profile.save().then(profile => res.json(profile));
  })
  .catch(err => res.status(404).json(err));
});

// @routes  DELETE api/profile/education/:id
// @desc    DELETE education from profile
// @access  Private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false}), 
(req, res) => {
    
  Profile.findOne({ user: req.user.id }).then(profile => {
    // Get remove index
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    // Splice out of array
    profile.education.splice(removeIndex);

    // Save
    profile.save().then(profile => res.json(profile));
  })
  .catch(err => res.status(404).json(err));
});

// @routes  DELETE api/profile/
// @desc    DELETE user and profile
// @access  Private
router.delete(
  '/', 
  passport.authenticate('jwt', { session: false}), 
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id })
      .then(() => {
        User.findOneAndRemove({ _id: req.user.id })
          .then(() => res.json({ success: true })
        );
      });
  }
);

module.exports = router;