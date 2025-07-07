AFRAME.registerComponent("data-swv-player", {
  schema: {
    cameraRig: { type: "selector", default: "#camera-rig" },
    playerModel: { type: "selector", default: "#player-model-entity" },
    animWalking: { type: "string", default: "walking" },
    animIdle: { type: "string", default: "idle" },
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

    // Animation
    if (this.data.playerModel) {
      this.data.playerModel.setAttribute("animation-mixer", {
        clip: "CharacterArmature|Idle",
        loop: "repeat",
      });
    }
  },

  tick: function (_unused, timeDelta) {
    const data = this.data;
    const delta = timeDelta / 1000;

    // const groundY =
    //   (this.isCrouching ? data.crouchHeight : data.playerHeight) / 2;
    const groundY = 0;

    // --- JUMP & GRAVITY LOGIC ---
    if (this.el.object3D.position.y > groundY || this.velocity.y > 0) {
      this.velocity.y += data.gravity * delta;
      this.isJumping = true;
    } else {
      this.velocity.y = 0;
      this.el.object3D.position.y = groundY;
      this.isJumping = false;
    }

    // -- Horizontal Movement --
    this.direction.set(0, 0, 0);
    const currentSpeed = this.isCrouching ? data.crouchSpeed : data.speed;

    if (this.keys.w) this.direction.z = -1;
    if (this.keys.s) this.direction.z = 1;
    if (this.keys.a) this.direction.x = -1;
    if (this.keys.d) this.direction.x = 1;

    // Animation switching and model rotation based on movement
    if (this.data.playerModel) {
      const model = this.data.playerModel.object3D;

      if (this.direction.lengthSq() > 0) {
        // Moving
        this.data.playerModel.setAttribute("animation-mixer", {
          clip: this.data.animWalking,
          loop: "repeat",
        });

        // Calculate movement direction relative to camera
        const cameraRotationY = data.cameraRig.object3D.rotation.y;
        const moveDir = new THREE.Vector3(this.direction.x, 0, this.direction.z).normalize();
        // If moving, calculate the angle to rotate the model to face movement direction
        if (moveDir.lengthSq() > 0) {
          // Get the angle of movement in world space
          const angle = Math.atan2(moveDir.x, moveDir.z); // -Z is forward
          const targetRotation = cameraRotationY + angle;
          // Smoothly rotate model to target rotation
          model.rotation.y += ((targetRotation - model.rotation.y + Math.PI * 3) % (Math.PI * 2) - Math.PI) * 0.2;
        }
      } else {
        // Idle
        this.data.playerModel.setAttribute("animation-mixer", {
          clip: this.data.animIdle,
          loop: "repeat",
        });
        // Optionally, keep model facing camera when idle
        // model.rotation.y += ((data.cameraRig.object3D.rotation.y + Math.PI - model.rotation.y + Math.PI * 3) % (Math.PI * 2) - Math.PI) * 0.2;
      }
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

      // Note: We use -this.direction.z for forward because -Z is forward in Three.js
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

    // -- Apply Final Velocity to the player's collision body --
    this.el.object3D.position.addScaledVector(this.velocity, delta);

    // -- Make the camera follow the player's collision body --
    data.cameraRig.object3D.position.copy(this.el.object3D.position);
  },

  onKeyDown: function (event) {
    const key = event.key.toLowerCase();
    this.keys[key] = true;

    if (event.code === "Space" && !this.isJumping && !this.isCrouching) {
      this.velocity.y = this.data.jumpForce;
    }

    if (key === "c" && !this.isCrouching && !this.isJumping) {
      this.isCrouching = true;
      if (this.data.playerModel) {
        // This animation still won't work correctly because gltf-model doesn't have a height property.
        // A better approach would be to scale the model or adjust its position.
        // For now, the logic remains but might not be visually effective.
        this.data.playerModel.setAttribute("animation", {
          property: "scale",
          to: `1 ${this.data.crouchHeight / this.data.playerHeight} 1`,
          dur: 200,
          easing: "easeOutQuad",
        });
      }
    }
  },

  onKeyUp: function (event) {
    const key = event.key.toLowerCase();
    this.keys[key] = false;

    if (key === "c") {
      this.isCrouching = false;
      if (this.data.playerModel) {
        this.data.playerModel.setAttribute("animation", {
          property: "scale",
          to: "1 1 1",
          dur: 200,
          easing: "easeOutQuad",
        });
      }
    }
  },

  remove: function () {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  },
});