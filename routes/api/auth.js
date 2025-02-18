const express = require("express");

const ctrl = require("../../controllers");

const { validateBody, authenticate, upload } = require("../../middlewares");

const schemas = require("../../schemas");

const router = express.Router();

router.post(
  "/register",
  validateBody(schemas.authSchemas.joiRegisterSchema),
  ctrl.users.register
);

router.post(
  "/login",
  validateBody(schemas.authSchemas.joiLoginSchema),
  ctrl.users.login
);

router.post("/logout", authenticate, ctrl.users.logout);

router.get("/current", authenticate, ctrl.users.getCurrent);

router.patch(
  "/subscription",
  authenticate,
  validateBody(schemas.authSchemas.joiUserPatchSchema),
  ctrl.users.updateSubscriptionValue
);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.users.updateAvatar
);

module.exports = router;
