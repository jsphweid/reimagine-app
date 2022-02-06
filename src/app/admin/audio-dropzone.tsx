import React from "react";
import Dropzone from "react-dropzone";

// generic styles from their examples
const baseStyle = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

interface AudioDropzoneProps {
  onFiles: (files: File[]) => void;
}

function AudioDropzone(props: AudioDropzoneProps) {
  return (
    <Dropzone onDrop={props.onFiles} accept="audio/midi">
      {({ getRootProps, getInputProps }) => (
        <section className="container">
          <div {...getRootProps({ style: baseStyle })}>
            <input {...getInputProps()} />
            <p>Midi files only!</p>
          </div>
        </section>
      )}
    </Dropzone>
  );
}

export default AudioDropzone;
