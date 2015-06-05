var React = require('react');
var Device = require('./Device');

module.exports = React.createClass({
  loadDataFromServer: function() {
    $.ajax({
      type: 'GET',
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleChange: function(device) {
    var data = {id: device.id, name: device.name, state: device.state};
    $.ajax({
      type: 'POST',
      url: this.props.url,
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(data)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadDataFromServer();
  },
  render: function() {
    var deviceNodes = this.state.data.map(function(device, index) {
      return (
        <Device
          id={device.id}
          name={device.name}
          state={device.state}
          onChange={this.handleChange}
          key={index}
        >
        </Device>
      );
    }.bind(this));
    return (
      <div className='deviceList'>
        {deviceNodes}
      </div>
    );
  }
});
