import React from 'react';
import classes from './UploadListItem.module.scss';

// import CircularLoader from '../Loaders/CircularLoader';

export const UploadListItem = ({ filename, size, progress }) => {
  return (
    <div className={classes.UploadListItem}>
      {/* row */}
      <div className={classes.UploadDetails}>
        <div className={classes.Label} title={filename}>
          {filename}
        </div>
        <div className={classes.FileSize}>
          {Number(size / 1024).toFixed(2)}KB
        </div>
      </div>
    </div>
  );
};
