AFRAME.registerComponent("data-swv-player", {
  schema: {
    cameraRig: { type: "selector", default: "#camera-rig" },
    playerModel: { type: "selector", default: "#player-model" },
    speed: { type: "number", default: 5.0 },
    crouchSpeed: { type: "number", default: 2.5 },
    jumpForce: { type: "number", default: 8.0 },
    gravity: { type: "number", default: -19.6 },
    playerHeight: { type: "number", default: 1.8 },
    crouchHeight: { type: "number", default: 1.0 },
  },

  init: function () {
    this.el.object3D.position.set(0, this.data.playerHeight / 2, 0);

    // State
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.keys = {};
    this.isJumping = false;
    this.isCrouching = false;

    // Helpers
    this.forwardVector = new THREE.Vector3();
    this.rightVector = new THREE.Vector3();
    this.moveVector = new THREE.Vector3();

    // Bindings
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  },

  tick: function (time, timeDelta) {
    const data = this.data;
    const delta = timeDelta / 1000;

    const groundY =
      (this.isCrouching ? data.crouchHeight : data.playerHeight) / 2;

    // --- THE FIX: JUMP & GRAVITY LOGIC ---
    // The player is considered "in the air" if their position is above ground
    // OR if they have upward velocity (i.e., they have just jumped).
    if (this.el.object3D.position.y > groundY || this.velocity.y > 0) {
      // Apply gravity.
      this.velocity.y += data.gravity * delta;
      this.isJumping = true;
    } else {
      // Player is on the ground.
      this.velocity.y = 0;
      this.el.object3D.position.y = groundY; // Snap to ground.
      this.isJumping = false;
    }

    // -- Horizontal Movement --
    this.direction.set(0, 0, 0);
    const currentSpeed = this.isCrouching ? data.crouchSpeed : data.speed;

    if (this.keys.w) {
      this.direction.z = -1;
    }
    if (this.keys.s) {
      this.direction.z = 1;
    }
    if (this.keys.a) {
      this.direction.x = -1;
    }
    if (this.keys.d) {
      this.direction.x = 1;
    }

    if (this.direction.lengthSq() > 0) {
      this.direction.normalize();
      const cameraRotationY = data.cameraRig.object3D.rotation.y;

      this.forwardVector
        .set(0, 0, -1)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraRotationY);
      this.rightVector
        .set(1, 0, 0)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraRotationY);

      const forwardMovement = this.forwardVector.multiplyScalar(
        -this.direction.z
      );
      const sideMovement = this.rightVector.multiplyScalar(this.direction.x);

      this.moveVector
        .copy(forwardMovement.add(sideMovement))
        .normalize()
        .multiplyScalar(currentSpeed);

      this.velocity.x = this.moveVector.x;
      this.velocity.z = this.moveVector.z;
    } else {
      this.velocity.x = 0;
      this.velocity.z = 0;
    }

    // -- Apply Final Velocity --
    this.el.object3D.position.addScaledVector(this.velocity, delta);

    // -- Camera Following --
    data.cameraRig.object3D.position.copy(this.el.object3D.position);
  },

  onKeyDown: function (event) {
    const key = event.key.toLowerCase();
    this.keys[key] = true;

    if (event.code === "Space" && !this.isJumping && !this.isCrouching) {
      // Apply jump force. The tick function will handle the rest.
      this.velocity.y = this.data.jumpForce;
    }

    if (key === "c" && !this.isCrouching && !this.isJumping) {
      this.isCrouching = true;
      this.data.playerModel.setAttribute("animation", {
        property: "height",
        to: this.data.crouchHeight,
        dur: 200,
        easing: "easeOutQuad",
      });
    }
  },

  onKeyUp: function (event) {
    const key = event.key.toLowerCase();
    this.keys[key] = false;

    if (key === "c") {
      this.isCrouching = false;
      this.data.playerModel.setAttribute("animation", {
        property: "height",
        to: this.data.playerHeight,
        dur: 200,
        easing: "easeOutQuad",
      });
    }
  },

  remove: function () {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  },
});
