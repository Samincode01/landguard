-- CreateTable
CREATE TABLE "LandParcel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "district" TEXT NOT NULL,
    "upazila" TEXT NOT NULL,
    "mouza" TEXT NOT NULL,
    "jlNumber" TEXT NOT NULL,
    "khatianNumber" TEXT NOT NULL,
    "dagNumber" TEXT NOT NULL,
    "khatianType" TEXT NOT NULL,
    "recordedArea" REAL NOT NULL,
    "areaUnit" TEXT NOT NULL DEFAULT 'decimal',
    "latitude" REAL,
    "longitude" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OwnershipRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerName" TEXT NOT NULL,
    "landParcelId" TEXT NOT NULL,
    "deedNumber" TEXT,
    "recordedArea" REAL,
    "areaUnit" TEXT DEFAULT 'decimal',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OwnershipRecord_landParcelId_fkey" FOREIGN KEY ("landParcelId") REFERENCES "LandParcel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentFilename" TEXT,
    "extractedData" TEXT,
    "targetLandParcelId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
    "riskScore" INTEGER,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VerificationRequest_targetLandParcelId_fkey" FOREIGN KEY ("targetLandParcelId") REFERENCES "LandParcel" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RiskFlag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "verificationRequestId" TEXT NOT NULL,
    "flagCode" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RiskFlag_verificationRequestId_fkey" FOREIGN KEY ("verificationRequestId") REFERENCES "VerificationRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "LandParcel_district_upazila_mouza_idx" ON "LandParcel"("district", "upazila", "mouza");

-- CreateIndex
CREATE INDEX "LandParcel_mouza_dagNumber_idx" ON "LandParcel"("mouza", "dagNumber");

-- CreateIndex
CREATE INDEX "LandParcel_mouza_khatianNumber_idx" ON "LandParcel"("mouza", "khatianNumber");

-- CreateIndex
CREATE INDEX "OwnershipRecord_landParcelId_idx" ON "OwnershipRecord"("landParcelId");

-- CreateIndex
CREATE INDEX "OwnershipRecord_ownerName_idx" ON "OwnershipRecord"("ownerName");

-- CreateIndex
CREATE INDEX "VerificationRequest_status_idx" ON "VerificationRequest"("status");

-- CreateIndex
CREATE INDEX "VerificationRequest_riskLevel_idx" ON "VerificationRequest"("riskLevel");

-- CreateIndex
CREATE INDEX "VerificationRequest_targetLandParcelId_idx" ON "VerificationRequest"("targetLandParcelId");

-- CreateIndex
CREATE INDEX "RiskFlag_verificationRequestId_idx" ON "RiskFlag"("verificationRequestId");

-- CreateIndex
CREATE INDEX "RiskFlag_severity_idx" ON "RiskFlag"("severity");
