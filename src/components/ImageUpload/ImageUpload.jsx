import React from 'react';
import DropzoneS3Uploader from 'react-dropzone-s3-uploader';
import DropZone from '../DropZone/DropZone';

export default function ImageUpload({ state, setState, keyName }) {
  const handleFinishedUpload = (info) => {
    console.log('File uploaded with filename', info.filename);
    if (keyName === 'multiple' && state.img.length < 6) {
      setState({ ...state, img: [...state.img, info.fileUrl] });
    } else if (keyName === 'multiple' && state.img.length >= 6) {
      alert('Delete some pics');
    } else {
      setState({ ...state, [keyName]: info.fileUrl });
    }
  };

  const uploadOptions = {
    server: 'http://localhost:5000',
  };

  const s3Url = 'https://snowswaps.s3.amazonaws.com';

  return (
    <DropzoneS3Uploader
      onFinish={handleFinishedUpload}
      s3Url={s3Url}
      maxSize={1024 * 1024 * 5}
      maxFiles={6}
      upload={uploadOptions}
    >
      <DropZone />
    </DropzoneS3Uploader>
  );
}
