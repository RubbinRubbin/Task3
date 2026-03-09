import { Router, type Request, type Response } from "express";
import { GenerateRequestSchema } from "../schemas.js";
import { generateReviews } from "../services/openai.js";
import { AppError } from "../lib/errors.js";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const startTime = performance.now();

  const parsed = GenerateRequestSchema.safeParse(req.body);
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
    const { reviews, model } = await generateReviews(parsed.data.count);

    res.json({
      success: true,
      data: reviews,
      meta: {
        model,
        processingTimeMs: Math.round(performance.now() - startTime),
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

    console.error("Unexpected error in /api/generate:", error);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" },
    });
  }
});

export default router;
