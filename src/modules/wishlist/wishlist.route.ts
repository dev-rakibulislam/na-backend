import { Router } from "express";
import { wishlistController } from "./wishlist.controller";

const router = Router();

// router.use(authMiddleware());

router.get("/", wishlistController.getWishlist);
router.post("/items", wishlistController.addWishlistItem);
router.delete("/items/:productId", wishlistController.removeWishlistItem);
router.delete("/", wishlistController.clearWishlist);

export default router;

export const wishlistRouter = router;
