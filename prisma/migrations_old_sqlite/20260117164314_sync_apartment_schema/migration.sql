-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Apartment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "pricePerNight" REAL NOT NULL,
    "pricePerMonth" REAL,
    "bedrooms" INTEGER NOT NULL DEFAULT 1,
    "hasAirCon" BOOLEAN NOT NULL DEFAULT false,
    "hasWifi" BOOLEAN NOT NULL DEFAULT true,
    "hasKitchen" BOOLEAN NOT NULL DEFAULT false,
    "images" TEXT,
    "amenities" TEXT,
    "serviceFee" REAL NOT NULL DEFAULT 0,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Apartment" ("amenities", "createdAt", "description", "id", "images", "location", "pricePerNight", "serviceFee", "slug", "title", "updatedAt") SELECT "amenities", "createdAt", "description", "id", "images", "location", "pricePerNight", "serviceFee", "slug", "title", "updatedAt" FROM "Apartment";
DROP TABLE "Apartment";
ALTER TABLE "new_Apartment" RENAME TO "Apartment";
CREATE UNIQUE INDEX "Apartment_slug_key" ON "Apartment"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
