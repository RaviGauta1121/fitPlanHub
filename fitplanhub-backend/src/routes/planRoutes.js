const express = require("express");
const {
  createPlan,
  getAllPlans,
  getPlanById,
  getTrainerPlans,
  updatePlan,
  deletePlan,
  searchPlans, // Add this
} = require("../controllers/planController");
const { protect } = require("../middleware/authMiddleware");
const { checkRole } = require("../middleware/roleMiddleware");
const { validatePlan, handleValidationErrors } = require("../utils/validators");

const router = express.Router();

router.get("/search", protect, searchPlans); // Add this before /:id route
router.post(
  "/",
  protect,
  checkRole("trainer"),
  validatePlan,
  handleValidationErrors,
  createPlan
);
router.get("/", protect, getAllPlans);
router.get("/my-plans", protect, checkRole("trainer"), getTrainerPlans);
router.get("/:id", protect, getPlanById);
router.put("/:id", protect, checkRole("trainer"), updatePlan);
router.delete("/:id", protect, checkRole("trainer"), deletePlan);

module.exports = router;
