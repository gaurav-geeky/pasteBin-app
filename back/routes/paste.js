import express from "express";
import Paste from "../models/Pastemodel.js";
import { getNow } from "../utils/time.js";

const router = express.Router();

// 1st pastes

router.post("/pastes", async (req, res) => {
    const { content, ttl_seconds, max_views } = req.body;

    // Validation
    if (!content || typeof content !== "string" || content.trim() === "") {
        return res.status(400).json({ error: "Invalid content" });
    }

    if (ttl_seconds && ttl_seconds < 1) {
        return res.status(400).json({ error: "Invalid ttl_seconds" });
    }

    if (max_views && max_views < 1) {
        return res.status(400).json({ error: "Invalid max_views" });
    }

    const now = getNow(req);

    const paste = await Paste.create({
        content,
        expiresAt: ttl_seconds
            ? new Date(now.getTime() + ttl_seconds * 1000)
            : null,
        maxViews: max_views || null,
    });

    res.status(201).json({
        id: paste._id,
        url: `${process.env.FRONTEND_URL}/p/${paste._id}`,
    });
});

//  2nd paste : id 

router.get("/pastes/:id", async (req, res) => {
    const paste = await Paste.findById(req.params.id);
    if (!paste) return res.status(404).json({ error: "Not found" });

    const now = getNow(req);

    // TTL check
    if (paste.expiresAt && now > paste.expiresAt) {
        return res.status(404).json({ error: "Expired" });
    }

    // View limit check
    if (paste.maxViews && paste.views >= paste.maxViews) {
        return res.status(404).json({ error: "View limit exceeded" });
    }

    paste.views += 1;
    await paste.save();

    res.json({
        content: paste.content,
        remaining_views: paste.maxViews
            ? Math.max(paste.maxViews - paste.views, 0)
            : null,
        expires_at: paste.expiresAt,
    });
});


// HTML view route  3rd

router.get("/p/:id", async (req, res) => {
    const paste = await Paste.findById(req.params.id);
    if (!paste) return res.status(404).send("Not found");

    const now = getNow(req);

    // TTL check
    if (paste.expiresAt && now > paste.expiresAt) {
        return res.status(404).send("Expired");
    }

    // View limit check
    if (paste.maxViews && paste.views >= paste.maxViews) {
        return res.status(404).send("View limit exceeded");
    }

    paste.views += 1;
    await paste.save();

    res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Paste</title>
      </head>
      <body>
        <pre>${paste.content.replace(/</g, "&lt;")}</pre>
      </body>
    </html>
  `);
});




export default router;
