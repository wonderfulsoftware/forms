import { createContext, FC, useContext, useEffect, useId, useRef } from "react";
import { Core, Dashboard, XHRUpload } from "uppy";
import "uppy/dist/uppy.min.css";

export const UploadEndpointContext = createContext("/api/upload");

export interface Uploader {
  onFinish: (url: string) => void;
}
export const Uploader: FC<Uploader> = (props) => {
  const id = useId();
  const endpoint = useContext(UploadEndpointContext);
  const onFinishRef = useRef(props.onFinish);
  useEffect(() => {
    onFinishRef.current = props.onFinish;
  }, [props.onFinish]);
  useEffect(() => {
    const uppy = new Core();
    uppy.use(Dashboard, {
      target: "body",
      trigger: `[id="${id}"] .js-uppy`,
      height: 320,
      showProgressDetails: true,
    });
    uppy.use(XHRUpload, { endpoint });
    uppy.setOptions({
      restrictions: {
        maxFileSize: 5 * 1024 * 1024,
        maxNumberOfFiles: 1,
        allowedFileTypes: ["image/*"],
      },
    });
    uppy.on("complete", (result) => {
      const image = result.successful[0];
      if (image) {
        onFinishRef.current?.(image.uploadURL);
      }
    });
    return () => {
      uppy.close();
    };
  }, [id, endpoint]);
  return (
    <div id={id}>
      <button type="button" className="btn btn-primary js-uppy">
        Upload file
      </button>
    </div>
  );
};
