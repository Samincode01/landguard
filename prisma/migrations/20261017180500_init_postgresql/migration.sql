-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandParcel" (
    "id" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "upazila" TEXT NOT NULL,
    "mouza" TEXT NOT NULL,
    "jlNumber" TEXT NOT NULL,
    "khatianNumber" TEXT NOT NULL,
    "dagNumber" TEXT NOT NULL,
    "khatianType" TEXT NOT NULL,
    "recordedArea" DOUBLE PRECISION NOT NULL,
    "areaUnit" TEXT NOT NULL DEFAULT 'decimal',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandParcel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnershipRecord" (
    "id" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "landParcelId" TEXT NOT NULL,
    "deedNumber" TEXT,
    "recordedArea" DOUBLE PRECISION,
    "areaUnit" TEXT DEFAULT 'decimal',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OwnershipRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationRequest" (
    "id" TEXT NOT NULL,
    "documentFilename" TEXT,
    "extractedData" TEXT,
    "targetLandParcelId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
    "riskScore" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskFlag" (
    "id" TEXT NOT NULL,
    "verificationRequestId" TEXT NOT NULL,
    "flagCode" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiskFlag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

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

-- AddForeignKey
ALTER TABLE "OwnershipRecord" ADD CONSTRAINT "OwnershipRecord_landParcelId_fkey" FOREIGN KEY ("landParcelId") REFERENCES "LandParcel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_targetLandParcelId_fkey" FOREIGN KEY ("targetLandParcelId") REFERENCES "LandParcel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskFlag" ADD CONSTRAINT "RiskFlag_verificationRequestId_fkey" FOREIGN KEY ("verificationRequestId") REFERENCES "VerificationRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
