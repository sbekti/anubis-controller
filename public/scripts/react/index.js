var socket = io();

var Device = React.createClass({
  getInitialState: function() {
    return {state: this.props.state};
  },
  componentDidMount: function () {
    socket.on('device:state', this.updateState);
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      state: nextProps.state
    });
  },
  handleChange: function(event) {
    var id = this.props.id;
    var name = this.props.name;
    var state = event.target.checked ? 1 : 0;
    this.setState({state: state});
    this.props.onDeviceStateChange({id: id, name: name, state: state})
  },
  render: function() {
    return (
      <div className="device">
        <div className="checkbox">
          <label>
            <input type="checkbox" checked={this.state.state >= 1}
              onChange={this.handleChange} /> {this.props.name}
          </label>
        </div>
      </div>
    );
  },
  updateState: function(device) {
    if (device.id == this.props.id) {
      this.setState({
        state: device.state
      });
    }
  }
});

var DeviceList = React.createClass({
  handleDeviceStateChange: function(device) {
    this.props.onDeviceStateChange(device);
  },
  render: function() {
    var deviceNodes = this.props.data.map(function(device, index) {
      return (
        <Device
          id={device.id}
          name={device.name}
          state={device.state}
          onDeviceStateChange={this.handleDeviceStateChange}
          key={index}
        >
        </Device>
      );
    }.bind(this));
    return (
      <div className="deviceList">
        {deviceNodes}
      </div>
    );
  }
});

var DeviceBox = React.createClass({
  loadDevicesFromServer: function() {
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
  updateDeviceStateOnServer: function(device) {
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
    this.loadDevicesFromServer();
  },
  render: function() {
    return (
      <div className="deviceBox">
        <h1>Device List</h1>
        <DeviceList data={this.state.data}
          onDeviceStateChange={this.updateDeviceStateOnServer} />
      </div>
    );
  }
});

React.render(
  <DeviceBox url='/api/v1/devices' />,
  document.getElementById('content')
);
