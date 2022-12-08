import { message } from "antd";
import axios from "axios";

export const uploadProps = {
    action: process.env.NEXT_PUBLIC_DEVELOPMENT_UPLOAD ? process.env.NEXT_PUBLIC_DEVELOPMENT_UPLOAD : process.env.NEXT_PUBLIC_PRODUCTION_UPLOAD,
    multiple: false,
    maxCount: 1,
    onStart(file) {
      // console.log('onStart', file, file.name);
    },
    onError(err) {
      console.log("onError", err);
    },
    customRequest({
      action,
      data,
      file,
      filename,
      onError,
      onSuccess,
      withCredentials
    }) {
      const formData = new FormData();
      if (data) {
        Object.keys(data).forEach(key => {
          formData.append(key, data[key]);
        });
      }
      formData.append(filename, file);
      axios
        .post(action, formData, {
          withCredentials,
        })
        .then(({ data: response }) => {
          onSuccess(response, file);
        })
        .catch(onError);

      return {
        abort() {
          console.log("upload progress is aborted.");
        }
      };
    }
  };