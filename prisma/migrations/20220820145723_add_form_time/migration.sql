-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Form" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "uid" TEXT NOT NULL,
    "form" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "data" TEXT NOT NULL DEFAULT '{}',
    "state" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Form" ("data", "form", "id", "state", "token", "uid", "updatedAt") SELECT "data", "form", "id", "state", "token", "uid", "updatedAt" FROM "Form";
DROP TABLE "Form";
ALTER TABLE "new_Form" RENAME TO "Form";
CREATE UNIQUE INDEX "Form_uid_form_key" ON "Form"("uid", "form");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
