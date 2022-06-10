import { Component } from 'react';

export default class HandleChangeWidth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 4,
    };
    this.handleChangeWidth = this.handleChangeWidth.bind(this);
  }

  componentDidMount() {
    this.handleChangeWidth();
    window.addEventListener('resize', this.handleChangeWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleChangeWidth);
  }

  handleChangeWidth() {
    const detailWidth = window.innerWidth || document.body.clientWidth;
    if (detailWidth > 1200) {
      this.setState(() => ({ limit: 4 }));
    } else if (detailWidth > 1040) {
      this.setState(() => ({ limit: 3 }));
    } else if (detailWidth > 830) {
      this.setState(() => ({ limit: 2 }));
    } else {
      this.setState(() => ({ limit: 1 }));
    }
  }

  render() {
    return this.props.render(this.state.limit);
  }
}
