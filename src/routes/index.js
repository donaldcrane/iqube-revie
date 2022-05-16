import { Router } from "express";
import userRoutes from "./userRoutes";
import reviewRoutes from "./reviewRoutes";

const router = new Router();

router.use("/users", userRoutes);
router.use("/reviews", reviewRoutes);

export default router;
