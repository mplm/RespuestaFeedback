var update = require('./updateScheme.js'),
    user = require('./userScheme.js');

exports.newUpdate = function(aUpdateData, aCb) {
  user.findOne({
    "device.imei": aUpdateData.imei
  }, function(error, user) {
    if (error) {
      aCb(error);
      return;
    }
    if (!user || !user.email) {
      console.log("Update not registered because IMEI " + aUpdateData.imei +
                  "is not associated to any user " + JSON.stringify(aUpdateData));
      aCb(null, null);
      return;
    }
    new update({
      imei: aUpdateData.imei,
      user: user.email,
      channel: aUpdateData.channel,
      from_build_id: aUpdateData.from_build_id,
      to_build_id: aUpdateData.to_build_id,
      from_version: aUpdateData.from_version,
      to_version: aUpdateData.to_version,
    }).save(function(error, update) {
      if (error) {
        aCb(error);
        return;
      }
      aCb(null, update);
    });
  });
 };

exports.getAll = function(aCb) {
  update.find(
    {},
    function(error, updates) {
      if (error) {
        aCb(error);
        return;
      }
      aCb(null, updates);
    }
  );
};

exports.getAllForDevice = function(aImei, aCb) {
  update.find({
    imei: aImei
  }, {
    _id: true
  },
  function(error, updates){
    if (error) {
      aCb(error);
      return;
    }
    aCb(null, updates);
  });
};

exports.getAllForEmail = function(aEmail, aCb) {
  update.find({
    user: aEmail
  }, function(error, updates){
    if (error) {
      aCb(error);
      return;
    }
    aCb(null, updates);
  });
};

exports.remove = function(aId, aCb) {
  update.findOneAndRemove(
    { _id: aId },
    function(error) {
      if (error) {
        aCb(error);
        return;
      }
      aCb(null);
    }
  );
};
