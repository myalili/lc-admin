import { formatDate } from '../date';

const filter = function(value, fmt) {
  return formatDate(value, fmt);
};

export default {
  name: 'date',
  filter
};
