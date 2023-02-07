import React, { useState, useEffect, useReducer } from 'react';
import classes from './UploadDrop.module.scss';
import { UploadListItem } from './UploadListItem';

export const UploadDrop = () => {
  const dropRef = React.createRef();
  const uploadDropRef = React.createRef();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  useEffect(() => {
    const div = dropRef.current;
    div.addEventListener('dragenter', handleDragIn);
    div.addEventListener('dragleave', handleDragOut);
    div.addEventListener('dragover', handleDrag);
    div.addEventListener('drop', handleDrop);

    return function cleanup() {
      div.removeEventListener('dragenter', handleDragIn);
      div.removeEventListener('dragleave', handleDragOut);
      div.removeEventListener('dragover', handleDrag);
      div.removeEventListener('drop', handleDrop);
    };
  });

  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy'; //show this is a copy by using drag-copy cursor
  };

  const handleDragIn = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragCounter((prevDragCounter) => prevDragCounter++);
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      setDragging(true);
    }
  };

  const handleDragOut = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragCounter((prevDragCounter) => prevDragCounter--);
    if (dragCounter > 0) return;
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      //callback handleDrop
      // props.handleDrop(e.dataTransfer.files);
      let existingFiles = [];

      Array.from(event.dataTransfer.files).forEach((file) => {
        const existingFile = findDuplicateFile(file);
        if (existingFile) {
          console.error('Existing file:', existingFile);
          return;
        }
        existingFiles.push(file);
        console.warn('Added file:', file);
      });

      setSelectedFiles((prevState) => {
        return [...prevState, ...existingFiles];
      });

      event.dataTransfer.clearData();
      setDragCounter(0);
    }
  };

  const findDuplicateFile = (file) => {
    return selectedFiles.find((existingFile) => {
      const isDuplicate =
        existingFile.name === file.name &&
        existingFile.lastModified === file.lastModified &&
        existingFile.size === file.size &&
        existingFile.type === file.type;
      console.log('IS DUPLICATE? ', isDuplicate);
      return isDuplicate;
    });
  };

  const fileChangedHandler = (event) => {
    event.preventDefault();
    event.persist();
    const files = event.target.files;

    let existingFiles = [];

    Array.from(files).forEach((file) => {
      const existingFile = findDuplicateFile(file);
      if (existingFile) {
        console.error('Existing file:', existingFile);
        return;
      }
      existingFiles.push(file);
      console.warn('Added file:', file);
    });

    console.log('EXISTING: ', existingFiles);

    setSelectedFiles((prevState) => {
      console.log('waypoint1!!!!');
      return [...prevState, ...existingFiles];
    });
  };

  const removeFromList = (index) => {
    let updatedFiles = [
      ...selectedFiles.filter((item, i) => {
        return index !== i ? item : null;
      }),
    ];
    setSelectedFiles(updatedFiles);
  };

  const uploadHandler = (event) => {
    event.preventDefault();
    selectedFiles.forEach((item, index) => {
      console.log('uploadHandler item: ', item.name);
    });
  };

  let tempClasses = [];
  if (dragging) {
    tempClasses.push(classes.Dragging);
  }

  let fileList = [];
  if (selectedFiles) {
    fileList = selectedFiles.map((item, index) => {
      if (!selectedFiles[index].name) {
        return null;
      }
      const formData = new FormData();
      formData.append('image', selectedFiles[index], selectedFiles[index].name);

      console.log('selectedFiles[index]:', selectedFiles[index]);

      return (
        <div
          className={classes.UploadInteraction}
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <UploadListItem
            key={index}
            filename={selectedFiles[index].name}
            size={selectedFiles[index].size}
            progress={uploadProgress[index]}
          />
          <div>
            <div className={classes.Divider} />
            <div className={classes.UploadDelete}>
              <div
                style={{ width: '30px', height: '30px', cursor: 'pointer' }}
                onClick={(event) => {
                  event.preventDefault();
                  removeFromList(index);
                }}
              >
                <svg
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <div className={classes.UploadDrop}>
      <div
        ref={dropRef}
        className={[classes.DropWrapper, ...tempClasses].join(' ')}
      >
        <input
          ref={uploadDropRef}
          type='file'
          accept='image/*'
          multiple
          onChange={fileChangedHandler}
        />
        <div className={classes.UploadLabel}>
          <svg
            fill='none'
            stroke='currentColor'
            strokeWidth='1.5'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden='true'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            ></path>
          </svg>
          <p>Drag and drop files here</p>
        </div>
        <button
          onClick={(event) => {
            event.preventDefault();
            uploadDropRef.current.click();
          }}
        >
          Browse files
        </button>
      </div>
      <output>
        {selectedFiles.length
          ? fileList.map((each, index) => {
              return <div key={index}>{each}</div>;
            })
          : null}
      </output>
    </div>
  );
};
