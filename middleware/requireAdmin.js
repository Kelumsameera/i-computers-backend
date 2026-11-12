// Only signed-in administrators may use sensitive management endpoints.
export function requireAdmin(req, res, next) {
  if (!req.user?.email) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
}
