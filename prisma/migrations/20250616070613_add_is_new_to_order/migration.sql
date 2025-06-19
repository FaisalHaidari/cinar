-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "total" REAL NOT NULL,
    "phone" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "buildingNo" TEXT,
    "floor" TEXT,
    "apartmentNo" TEXT,
    "description" TEXT,
    "postalCode" TEXT,
    "city" TEXT,
    "country" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isNew" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("apartmentNo", "buildingNo", "city", "country", "createdAt", "description", "floor", "id", "phone", "postalCode", "street", "total", "userId") SELECT "apartmentNo", "buildingNo", "city", "country", "createdAt", "description", "floor", "id", "phone", "postalCode", "street", "total", "userId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
