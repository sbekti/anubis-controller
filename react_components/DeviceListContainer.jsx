var React = require('react');
var DeviceList = require('./DeviceList');

module.exports = React.createClass({
  render: function() {
    return (
      <div className='DeviceListContainer'>
        <h1>Device List</h1>
        <DeviceList url='/api/v1/devices' />
      </div>
    );
  }
});
