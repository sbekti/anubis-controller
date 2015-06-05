var React = require('react');
var socket = io();

module.exports = React.createClass({
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
    this.props.onChange({id: id, name: name, state: state})
  },
  render: function() {
    return (
      <div className='device'>
        <div className='checkbox'>
          <label>
            <input type='checkbox' checked={this.state.state >= 1}
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
