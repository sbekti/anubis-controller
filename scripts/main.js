require('../styles/main.scss');
require('../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js');

var React = require('react');
var DeviceListContainer = require('../react_components/DeviceListContainer');

React.render(
  <DeviceListContainer />,
    document.getElementById('react-root')
);
