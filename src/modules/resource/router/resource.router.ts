import { Router } from "express";
import {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} from "../controller/resource.controller";

const router = Router();

router.get("/", getResources);
router.get("/:id", getResourceById);
router.post("/", createResource);
router.patch("/:id", updateResource);
router.delete("/:id", deleteResource);

export default router;
