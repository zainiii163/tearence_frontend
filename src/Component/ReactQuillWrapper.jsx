import React, { forwardRef } from 'react';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";

const ReactQuillWrapper = forwardRef((props, ref) => {
  return (
    <ReactQuill
      {...props}
      ref={ref}
    />
  );
});

ReactQuillWrapper.displayName = 'ReactQuillWrapper';

export default ReactQuillWrapper;
