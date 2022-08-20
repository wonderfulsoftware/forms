import multer from "multer";
import { initMiddleware } from "init-middleware";
import { defineApiHandler } from "../../packlets/type-helpers";

const upload = multer({
  dest: ".data/uploads",
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const handleUpload = initMiddleware(upload.single("file"));

export default defineApiHandler(async (req, res) => {
  await handleUpload(req, res);
  console.log(req);
  res.send("ok");
});

export const config = {
  api: {
    bodyParser: false,
  },
};
