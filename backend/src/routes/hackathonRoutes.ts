import { Router } from "express";
import {
  getHackathons,
  getHackathonById,
  createHackathon,
  updateHackathon,
  deleteHackathon,
} from "../controllers/hackathonController";

const router = Router();

router.get("/", getHackathons);
router.post("/", createHackathon);
router.get("/:id", getHackathonById);
router.put("/:id", updateHackathon);
router.delete("/:id", deleteHackathon);

export default router;
