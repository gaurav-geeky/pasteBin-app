import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/healthz", async (req, res) => {
  const ok = mongoose.connection.readyState === 1;
  res.status(200).json({ ok });
});

export default router;



/*

TTL logic
...(ttl && { ttl_seconds: Number(ttl) })


Meaning:

If ttl is empty → ❌ don’t send anything

If ttl has value → ✅ send:

*/

