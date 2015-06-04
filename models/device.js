'use strict';

module.exports = function(sequelize, DataTypes) {
  var Device = sequelize.define('Device', {
    name: DataTypes.STRING,
    state: DataTypes.INTEGER,
    url: DataTypes.STRING
  }, {
    classMethods: {

    }
  });

  return Device;
};
