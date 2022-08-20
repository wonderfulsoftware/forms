-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "uid" TEXT NOT NULL,
    "form" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "data" TEXT NOT NULL DEFAULT '{}',
    "state" TEXT NOT NULL DEFAULT '{}',
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Form_uid_form_key" ON "Form"("uid", "form");
