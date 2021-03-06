import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

class ModalWindow extends React.Component {

  static propTypes = {
    content: PropTypes.any.isRequired,
    title: PropTypes.any,
    afterOpenModal: PropTypes.func,
    modalIsOpen: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    afterOpenModal: () => null,
    title: '',
    modalIsOpen: false,
  };

  state = {
    modalIsOpen: this.props.modalIsOpen
  };

  static getDerivedStateFromProps(props, state) {
    if (state.modalIsOpen !== props.modalIsOpen) {
      return {modalIsOpen: props.modalIsOpen};
    }
    return null;
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }


  render() {
    const { title, content, afterOpenModal } = this.props;
    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={this.closeModal}
        ariaHideApp={false}
        style={{
          overlay: {
            zIndex: '100000',
            background: 'rgba(0,0,0,.6)',
            border: 0,
          },
          content: {
            border: 0,
            background: 'none',
          },
        }}
        contentLabel="Example Modal"
      >
        <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-8 profit-block">
          <div className="modal__container">
            <div className="modal__header">
              <div className="container-fuild h-100">
                <div className="row h-100 align-items-center">
                  <div className="col-auto modal__title">
                    { title }
                  </div>
                </div>
              </div>
              <div className="modal__close" onClick={() => this.closeModal()}/>
            </div>
            <div className="modal__body">
              <div className="container d-flex flex-column ">
                <div className="row order-2 justify-content-center">
                  <div className="col-12">
                    {content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );}
}

export default ModalWindow;
