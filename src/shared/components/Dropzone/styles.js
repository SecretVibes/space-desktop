/* eslint-disable quotes */
import { makeStyles } from '@material-ui/core/styles';

export const rowHeight = 36;
export const headHeight = 39;

export default makeStyles({
  root: {
    display: 'flex',
    minHeight: '100%',
    '&:focus': {
      outline: 'none',
    },
  },
  wrapper: {
    minHeight: '100%',
  },
  rainbowField: {
    pointerEvents: 'none',
    position: 'absolute',
    opacity: 0.1,
    zIndex: 1,
    '& + &': {
      zIndex: 2,
      opacity: 1,
    },
  },
});
