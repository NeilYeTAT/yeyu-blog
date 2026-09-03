-- Remove replies that point to comments being retired with the NOTE target.
UPDATE "SiteComment" AS child
SET "parentId" = NULL
WHERE "parentId" IN (
    SELECT "id"
    FROM "SiteComment"
    WHERE "targetType" = 'NOTE'
);

DELETE FROM "SiteComment"
WHERE "targetType" = 'NOTE';

DROP TABLE "MutterComment";
DROP TABLE "MutterCommentConfig";
DROP TABLE "Mutter";
DROP TYPE "MutterCommentState";

DROP TABLE "_NoteToNoteTag";
DROP TABLE "NoteTag";
DROP TABLE "Note";

ALTER TABLE "BlogTag" DROP COLUMN "tagType";
DROP TYPE "TagType";

ALTER TYPE "SiteCommentTargetType" RENAME TO "SiteCommentTargetType_old";
CREATE TYPE "SiteCommentTargetType" AS ENUM ('BLOG');

ALTER TABLE "SiteComment"
ALTER COLUMN "targetType" TYPE "SiteCommentTargetType"
USING ("targetType"::text::"SiteCommentTargetType");

DROP TYPE "SiteCommentTargetType_old";
