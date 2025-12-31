import Settings from "../models/Settings.js";
import { isAdmin } from "./userController.js";

// GET SETTINGS
export async function getSettings(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// UPDATE SETTINGS
export async function updateSettings(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const updated = await Settings.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
