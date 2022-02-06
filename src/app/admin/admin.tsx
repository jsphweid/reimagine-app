import React from "react";

import Section from "../small-components/section";
import AudioDropzone from "./audio-dropzone";

function Admin() {
  const [rejectedFiles, setRejectedFiles] = React.useState<any[]>([]);

  function onDrop(acceptedFiles: any[], rejected: any[]) {
    setRejectedFiles(rejected);
    // this.props.dispatch(postMidiFiles(acceptedFiles));
  }

  function renderPossibleRejectedFilesError() {
    return rejectedFiles && rejectedFiles.length ? (
      <div>
        There are {rejectedFiles.length} files in this batch that cannot be
        uploaded because they aren't midi files.
      </div>
    ) : null;
  }

  function renderPostMidiInfo() {
    // const { uploadingMidiFailure, uploadingMidi, idsOfLatestUpload } =
    //   this.props;
    // switch (true) {
    //   case !!uploadingMidiFailure:
    //     return <p>{uploadingMidiFailure}</p>;
    //   case uploadingMidi:
    //     return <p>Uploading</p>;
    //   case !!idsOfLatestUpload && !!idsOfLatestUpload.length:
    //     return <p>{JSON.stringify(idsOfLatestUpload)}</p>;
    //   default:
    //     return null;
    // }
  }

  return (
    <Section>
      <AudioDropzone
        onFiles={(files) =>
          console.log(
            "TODO -- do something with these files:",
            files.map((f) => f.name)
          )
        }
      />
      {renderPostMidiInfo()}
      {renderPossibleRejectedFilesError()}
    </Section>
  );
}

export default Admin;
