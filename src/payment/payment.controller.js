const PaymentService = require("./payment.service");

const PaymentController = {};

PaymentController.findAll = async (req, res) => {
    let data = await PaymentService.findAll(req.params.value);
    res.status(200).send({ data: data, message: "success" });
}

PaymentController.create = async (req, res) => {
    let data = await PaymentService.create(req.body);
    res.status(data.status).send({ data, message } = data);
}

module.exports = PaymentController;