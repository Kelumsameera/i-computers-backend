import express from "express";
import { getSettings, updateSettings } from "../controllers/adminSettingsController.js";


const settingsRouter = express.Router();

settingsRouter.get("/", getSettings);

settingsRouter.put("/", updateSettings);
export default settingsRouter;