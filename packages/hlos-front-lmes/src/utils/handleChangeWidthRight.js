import { Component } from 'react';

import debouce from './utils';

export default class HandleChangeWidthRight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 4,
    };
    this.handleChangeWidth = debouce(this.changeWidthResult).bind(this);
  }

  componentDidMount() {
    this.handleChangeWidth();
    window.addEventListener('resize', this.handleChangeWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleChangeWidth);
  }

  changeWidthResult() {
    const detailWidth =
      (document.querySelectorAll('.hzero-normal-content-container') &&
        document.querySelectorAll('.hzero-normal-content-container')[0] &&
        document.querySelectorAll('.hzero-normal-content-container')[0].clientWidth) ||
      window.innerWidth ||
      document.body.clientWidth;
    if (detailWidth > 1400) {
      this.setState(() => ({ limit: 4 }));
    } else if (detailWidth > 1190) {
      this.setState(() => ({ limit: 3 }));
    } else if (detailWidth > 960) {
      this.setState(() => ({ limit: 2 }));
    } else {
      this.setState(() => ({ limit: 1 }));
    }
  }

  render() {
    return this.props.render(this.state.limit);
  }
}
