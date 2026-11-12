import { requireAdmin } from "../middleware/requireAdmin.js";
import express from "express";
import { getSettings, updateSettings } from "../controllers/adminSettingsController.js";


const settingsRouter = express.Router();

settingsRouter.get("/", getSettings);

settingsRouter.put("/", requireAdmin, updateSettings);
export default settingsRouter;
