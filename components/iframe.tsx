import React from 'react';

const IFrame = ({ src, width, height, title }: any) => {
  const iframeStyle = {
    border: 'none',
    overflow: 'hidden',
    width: width || '100%',
    height: height || '100%',
  };

  return (
    <iframe
      title={title || 'iframe'}
      src={src}
      style={iframeStyle}
      scrolling="no"
    />
  );
};

export default IFrame;
