import PropTypes from 'prop-types';

const api = PropTypes.shape({
  scrollToStart: PropTypes.func.isRequired,
  scrollToEnd: PropTypes.func.isRequired,
  addEventListener: PropTypes.func.isRequired,
  removeEventListener: PropTypes.func.isRequired,
  triggerEvent: PropTypes.func.isRequired,
  getScrollContainer: PropTypes.func.isRequired,
  scrollToTop: PropTypes.func.isRequired,
  scrollToBottom: PropTypes.func.isRequired,
});

api.parent = api;

export default api;
