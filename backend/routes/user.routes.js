const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const userConroller = require('../controllers/user.controller');
const uploadController = require('../controllers/upload.controller');
const multer = require('multer');
const upload = multer();

//auth
router.post('/register', authController.signUp);
router.post('/login', authController.signIn);
router.get('/logout', authController.logOut);

//crud
router.get('/', userConroller.getAllUsers);
router.get('/:id', userConroller.userInfo);
router.put('/:id', userConroller.updateUser);
router.delete('/:id', userConroller.deleteUser);
router.patch("/follow/:id", userConroller.follow);
router.patch('/unfollow/:id', userConroller.unfollow);

//upload images
router.post('/upload', upload.single('file'), uploadController.uploadProfil); //utiliser la bibliotèque multer

module.exports = router;