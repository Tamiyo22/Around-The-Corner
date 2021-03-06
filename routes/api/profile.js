const express = require("express");
const request = require("request");
const config = require("config");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator/check");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

//route GET api/profile/me
//description get current users profile
//access private

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({
        message: "there is no profile for user"
      });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).useChunkedEncodingByDefault("server error");
  }
});

//route POST api/profile/me
//description create or update user profile
//access private
router.post(
  "/",
  [
    auth,
    [
      check("status", "status is required ")
        .not()
        .isEmpty(),
      check("skills", "skills is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    const {
      status,
      bio,
      location,
      family,
      website,
      hobbies,
      skills,
      work,
      githubusername,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    //build profile object

    const profileFields = {};
    profileFields.user = req.user.id;
    if (status) profileFields.status = status;
    if (bio) profileFields.bio = bio;
    if (location) profileFields.location = location;
    // if (petTypes) profileFields.petTypes = petTypes.split(',').map((pet) => pet.trim());
    if (skills)
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    if (hobbies)
      profileFields.hobbies = hobbies.split(",").map(hobby => hobby.trim());

    profileFields.social = {};
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (githubusername) profileFields.social.githubusername = githubusername;
    if (youtube) profileFields.social.youtube = youtube;

    try {
      //find by the user id token
      let profile = await Profile.findOne({
        user: req.user.id
      });

      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          {
            // findByIdAndUpdate
            user: req.user.id
          },
          {
            $set: profileFields
          },
          {
            new: true
          }
        );

        return res.json(profile);
      }
      //create profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
);
//route GET api/profile
//description get all profiles
//access public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});

//route GET api/profile/user/:user_id
//description get profile by user id
//access public

router.get("/user/:user_id", async (req, res) => {
  try {
    const Profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    if (!profile)
      return res.status(400).json({
        message: "There is no profile for this user"
        //change later to profile not found
      });

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        message: "Profile not found"
      });
    }
    res.status(500).send("server error");
  }
});

//route DELETE api/profile
//description delete profile user and posts
//access private

router.delete("/", auth, async (req, res) => {
  try {
    //remove users posts

    //remove profile
    await Profile.findOneAndRemove({
      user: req.user.id
    });
    //remove user
    await User.findOneAndRemove({
      _id: req.user.id
    });

    //very cool mongoose
    //https://mongoosejs.com/docs/api.html
    res.json({
      message: "Profile deleted"
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
});

//route PUT  api/profile/experience
//description add profile experience
//access private

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("company", "Company is required")
        .not()
        .isEmpty(),
      check("date", "Date is required")
        .not()
        .isEmpty()
    ]
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({
        user: req.user.id
      });
      profile.experience.unshift(newExp);

      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      reponse.status(500).send("server error");
    }
  }
);

//route delete  api/profile/experience/exp_id
//description delete profile experience
//access private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    });

    // get remove index
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    reponse.status(500).send("server error");
  }
});

//route PUT  api/profile/edcuation
//description add profile edcuation
//access private

router.put(
  "/education",
  [
    auth,
    [
      check("school", "school is required")
        .not()
        .isEmpty(),
      check("area", "field is required")
        .not()
        .isEmpty(),
      check("date", "Date is required")
        .not()
        .isEmpty()
    ]
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }
    const { school, area, location, from, to, current, description } = req.body;

    const newEdu = {
      school,
      area,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({
        user: req.user.id
      });
      profile.education.unshift(newEdu);

      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      reponse.status(500).send("server error");
    }
  }
);

//route delete  api/profile/education/edu_id
//description delete profile edcuation
//access private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    });

    // get remove index
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    reponse.status(500).send("server error");
  }
});

// //route GET api/profile/github/:username
// //description get user projects from github
// //access public

// router.get("/github/:username", async (req, res) => {
// 	try {

// 		const options = {

// 			uri: `https://api.github.users/${
// 				req.params.username
// 			}/repos?per_page=2&
// 			sort=created:asc&client_id=${config.get(
// 				'githubClientId')
// 			}&client_secret=${config.get('githubSecret')}`,
// 			method: 'GET',
// 			headers: {
// 				'user-agent': 'node.js'
// 			}
// 		};

// 		request(options, (error, response, body) => {
// 			if (error) console.error(error)

// 			// if (response.statusCode !== 200) {
// 			// 	res.status(404).json({
// 			// 		message: "no profile found"
// 			// })

// 			res.json(JSON.parse(body))
// 		});
// 	} catch (error) {
// 		console.error(error.message);
// 		res.status(500).send("server error");
// 	}
// });

module.exports = router;
