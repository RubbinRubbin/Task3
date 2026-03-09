import { Router, type Request, type Response } from "express";
import { AnalyzeRequestSchema } from "../schemas.js";
import { analyzeSentiments } from "../services/openai.js";
import { AppError } from "../lib/errors.js";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const startTime = performance.now();

  // Validate request body
  const parsed = AnalyzeRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: parsed.error.issues.map((i) => i.message).join("; "),
      },
    });
    return;
  }

  try {
    const { results, model } = await analyzeSentiments(parsed.data.reviews);

    res.json({
      success: true,
      data: results,
      meta: {
        model,
        processingTimeMs: Math.round(performance.now() - startTime),
        reviewCount: parsed.data.reviews.length,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: { code: error.code, message: error.message },
      });
      return;
    }

    console.error("Unexpected error in /api/analyze:", error);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" },
    });
  }
});

export default router;
