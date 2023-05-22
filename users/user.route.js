const router = require('express').Router();
const UserService = require('./user.service');

router.get('/:value?', async (req, res) => {
    res.status(200).send({ data: await UserService.findAll(req.params.value ?? '') })
});
router.post('/login', async (req, res) => {
    let user = await UserService.login(req.body);
    res.status(user.status).send({ data, message } = user);
});

router.post('/', async (req, res) => {
    let user = await UserService.create(req.body);
    res.status(user.status).send({ data, message } = user);
});

router.put('/:id', async (req, res) => {
    let user = await UserService.update(req.body, req.params.id);
    res.status(user.status).send({ data, message } = user);
});

router.put('/password/:id', async (req, res) => {
    let user = await UserService.updatePassword(req.body, req.params.id);
    res.status(user.status).send({ data, message } = user);
});

module.exports = router;