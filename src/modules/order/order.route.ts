
import { Router } from "express";
import { orderController } from "./order.controller";

const router = Router();

router.post("/", orderController.createOrder);
router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrder);
router.patch("/:id", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);


export const orderRouter = router;
