/**
 * Land Document Extraction API Route
 * POST /api/verify/extract-document
 * LandGuard BD — Civic Tech for Land Due Diligence (Track P5)
 *
 * Accepts multipart/form-data upload of a land deed/khatian image or PDF.
 * Uses Google Gemini Vision via @google/genai on server-side.
 * Strictly avoids persisting files, secrets, or hallucinating missing fields.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  extractDocumentFields,
  validateUploadFile,
  AllowedMimeType,
} from "@/lib/document-extractor";

export async function POST(request: NextRequest) {
  try {
    // 1. Content-Type check
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_REQUEST",
          code: "INVALID_REQUEST",
          message: "অনুরোধের ফরম্যাট অবৈধ। multipart/form-data ফরম্যাটে ফাইল প্রেরণ করুন। (Invalid request format)",
        },
        { status: 400 }
      );
    }

    // 2. Parse form data
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "MALFORMED_FORM_DATA",
          code: "MALFORMED_FORM_DATA",
          message: "আপলোডকৃত ফাইল পার্স করা সম্ভব হয়নি। (Malformed form data)",
        },
        { status: 400 }
      );
    }

    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "NO_FILE_PROVIDED",
          code: "NO_FILE_PROVIDED",
          message: "কোনো দলিলের ফাইল আপলোড করা হয়নি। (No document file was provided)",
        },
        { status: 400 }
      );
    }

    // Resolve MIME type: support browser-reported mime or determine by extension
    let mimeType = file.type;
    if (!mimeType) {
      const name = file.name.toLowerCase();
      if (name.endsWith(".jpg") || name.endsWith(".jpeg")) mimeType = "image/jpeg";
      else if (name.endsWith(".png")) mimeType = "image/png";
      else if (name.endsWith(".webp")) mimeType = "image/webp";
      else if (name.endsWith(".pdf")) mimeType = "application/pdf";
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Server-side validation of file type & size
    const validation = validateUploadFile(buffer, mimeType);
    if (!validation.isValid) {
      const status = validation.code === "FILE_TOO_LARGE" ? 413 : 400;
      return NextResponse.json(
        {
          success: false,
          error: validation.code,
          code: validation.code,
          message: validation.error,
        },
        { status }
      );
    }

    // 4. Check if GEMINI_API_KEY is configured
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "GEMINI_NOT_CONFIGURED",
          code: "GEMINI_NOT_CONFIGURED",
          message: "Gemini API key is not configured on the server. Please fill in the verification form manually.",
          messageBn: "সার্ভারে Gemini API কী কনফিগার করা নেই। আপনি নিচে সরাসরি দলিলের তথ্য লিখে যাচাই সম্পন্ন করতে পারেন।",
        },
        { status: 503 }
      );
    }

    // 5. Extract fields using Gemini Vision
    const result = await extractDocumentFields(buffer, mimeType as AllowedMimeType);

    if (!result.success) {
      let status = 502;
      if (result.code === "TIMEOUT") status = 504;
      else if (result.code === "API_KEY_INVALID") status = 401;
      else if (result.code === "QUOTA_EXCEEDED") status = 429;
      else if (result.code === "MODEL_UNAVAILABLE") status = 503;

      return NextResponse.json(
        {
          success: false,
          error: result.error,
          code: result.code,
          message: result.message,
          messageBn: result.messageBn,
        },
        { status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Internal server error";
    console.error("[API /api/verify/extract-document Error]", errorMsg);

    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        code: "INTERNAL_SERVER_ERROR",
        message: "সার্ভারে অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে নিচে নিজে তথ্য পূরণ করুন। (Server error)",
      },
      { status: 500 }
    );
  }
}
