import multer from "multer";
import { initMiddleware } from "init-middleware";
import { defineApiHandler } from "../../packlets/type-helpers";
import { prisma } from "../../server/db/client";

const upload = multer({
  dest: ".data/uploads",
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const handleUpload = initMiddleware(upload.single("file"));

export default defineApiHandler(async (req, res) => {
  const id = String(req.query.id);
  const token = String(req.query.token);
  const form = await prisma.form.findFirst({ where: { id } });
  if (!form || form.token !== token) {
    res.status(404).send("Form not found or token is invalid");
    return;
  }
  await handleUpload(req, res);
  const file = getFile(req);
  const url = `uploaded-file://${file.filename}/?${new URLSearchParams({
    filename: file.originalname,
    type: file.mimetype,
    size: String(file.size),
  })}`;
  res.json({ ok: true, url });
});

function getFile(req: any): Express.Multer.File {
  if (!req.file) {
    throw new Error("Expected a file");
  }
  return req.file;
}

/*
  file: {
    fieldname: 'file',
    originalname: 'copperbar.jpeg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    destination: '.data/uploads',
    filename: 'e647b8598caaee3c1d3b73beb6289351',
    path: '.data/uploads/e647b8598caaee3c1d3b73beb6289351',
    size: 490683
  },*/

export const config = {
  api: {
    bodyParser: false,
  },
};
