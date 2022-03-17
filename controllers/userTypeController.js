const Usertypes = require('../models/usertypes');

exports.findUsertypes = () => {
    return Usertypes.find().exec();
};

exports.findUsertype = (id) => {
    return Usertypes.findById(id).exec();
};
