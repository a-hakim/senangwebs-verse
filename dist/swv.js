/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["SWV"] = factory();
	else
		root["SWV"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/swv.js":
/*!***********************!*\
  !*** ./src/js/swv.js ***!
  \***********************/
/***/ (() => {

eval("{AFRAME.registerComponent(\"data-swv-player\", {\n  schema: {\n    cameraRig: {\n      type: \"selector\",\n      \"default\": \"#camera-rig\"\n    },\n    playerModel: {\n      type: \"selector\",\n      \"default\": \"#player-model-entity\"\n    },\n    animWalking: {\n      type: \"string\",\n      \"default\": \"walking\"\n    },\n    animIdle: {\n      type: \"string\",\n      \"default\": \"idle\"\n    },\n    speed: {\n      type: \"number\",\n      \"default\": 5.0\n    },\n    crouchSpeed: {\n      type: \"number\",\n      \"default\": 2.5\n    },\n    jumpForce: {\n      type: \"number\",\n      \"default\": 8.0\n    },\n    gravity: {\n      type: \"number\",\n      \"default\": -19.6\n    },\n    playerHeight: {\n      type: \"number\",\n      \"default\": 1.8\n    },\n    crouchHeight: {\n      type: \"number\",\n      \"default\": 1.0\n    }\n  },\n  init: function init() {\n    this.el.object3D.position.set(0, this.data.playerHeight / 2, 0);\n\n    // State\n    this.velocity = new THREE.Vector3();\n    this.direction = new THREE.Vector3();\n    this.keys = {};\n    this.isJumping = false;\n    this.isCrouching = false;\n\n    // Helpers\n    this.forwardVector = new THREE.Vector3();\n    this.rightVector = new THREE.Vector3();\n    this.moveVector = new THREE.Vector3();\n\n    // Bindings\n    this.onKeyDown = this.onKeyDown.bind(this);\n    this.onKeyUp = this.onKeyUp.bind(this);\n    window.addEventListener(\"keydown\", this.onKeyDown);\n    window.addEventListener(\"keyup\", this.onKeyUp);\n\n    // Animation\n    if (this.data.playerModel) {\n      this.data.playerModel.setAttribute(\"animation-mixer\", {\n        clip: \"CharacterArmature|Idle\",\n        loop: \"repeat\"\n      });\n    }\n  },\n  tick: function tick(_unused, timeDelta) {\n    var data = this.data;\n    var delta = timeDelta / 1000;\n\n    // const groundY =\n    //   (this.isCrouching ? data.crouchHeight : data.playerHeight) / 2;\n    var groundY = 0;\n\n    // --- JUMP & GRAVITY LOGIC ---\n    if (this.el.object3D.position.y > groundY || this.velocity.y > 0) {\n      this.velocity.y += data.gravity * delta;\n      this.isJumping = true;\n    } else {\n      this.velocity.y = 0;\n      this.el.object3D.position.y = groundY;\n      this.isJumping = false;\n    }\n\n    // -- Horizontal Movement --\n    this.direction.set(0, 0, 0);\n    var currentSpeed = this.isCrouching ? data.crouchSpeed : data.speed;\n    if (this.keys.w) this.direction.z = -1;\n    if (this.keys.s) this.direction.z = 1;\n    if (this.keys.a) this.direction.x = -1;\n    if (this.keys.d) this.direction.x = 1;\n\n    // Animation switching and model rotation based on movement\n    if (this.data.playerModel) {\n      var model = this.data.playerModel.object3D;\n      if (this.direction.lengthSq() > 0) {\n        // Moving\n        this.data.playerModel.setAttribute(\"animation-mixer\", {\n          clip: this.data.animWalking,\n          loop: \"repeat\"\n        });\n\n        // Calculate movement direction relative to camera\n        var cameraRotationY = data.cameraRig.object3D.rotation.y;\n        var moveDir = new THREE.Vector3(this.direction.x, 0, this.direction.z).normalize();\n        // If moving, calculate the angle to rotate the model to face movement direction\n        if (moveDir.lengthSq() > 0) {\n          // Get the angle of movement in world space\n          var angle = Math.atan2(moveDir.x, moveDir.z); // -Z is forward\n          var targetRotation = cameraRotationY + angle;\n          // Smoothly rotate model to target rotation\n          model.rotation.y += ((targetRotation - model.rotation.y + Math.PI * 3) % (Math.PI * 2) - Math.PI) * 0.2;\n        }\n      } else {\n        // Idle\n        this.data.playerModel.setAttribute(\"animation-mixer\", {\n          clip: this.data.animIdle,\n          loop: \"repeat\"\n        });\n        // Optionally, keep model facing camera when idle\n        // model.rotation.y += ((data.cameraRig.object3D.rotation.y + Math.PI - model.rotation.y + Math.PI * 3) % (Math.PI * 2) - Math.PI) * 0.2;\n      }\n    }\n    if (this.direction.lengthSq() > 0) {\n      this.direction.normalize();\n      var _cameraRotationY = data.cameraRig.object3D.rotation.y;\n      this.forwardVector.set(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), _cameraRotationY);\n      this.rightVector.set(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), _cameraRotationY);\n\n      // Note: We use -this.direction.z for forward because -Z is forward in Three.js\n      var forwardMovement = this.forwardVector.multiplyScalar(-this.direction.z);\n      var sideMovement = this.rightVector.multiplyScalar(this.direction.x);\n      this.moveVector.copy(forwardMovement.add(sideMovement)).normalize().multiplyScalar(currentSpeed);\n      this.velocity.x = this.moveVector.x;\n      this.velocity.z = this.moveVector.z;\n    } else {\n      this.velocity.x = 0;\n      this.velocity.z = 0;\n    }\n\n    // -- Apply Final Velocity to the player's collision body --\n    this.el.object3D.position.addScaledVector(this.velocity, delta);\n\n    // -- Make the camera follow the player's collision body --\n    data.cameraRig.object3D.position.copy(this.el.object3D.position);\n  },\n  onKeyDown: function onKeyDown(event) {\n    var key = event.key.toLowerCase();\n    this.keys[key] = true;\n    if (event.code === \"Space\" && !this.isJumping && !this.isCrouching) {\n      this.velocity.y = this.data.jumpForce;\n    }\n    if (key === \"c\" && !this.isCrouching && !this.isJumping) {\n      this.isCrouching = true;\n      if (this.data.playerModel) {\n        // This animation still won't work correctly because gltf-model doesn't have a height property.\n        // A better approach would be to scale the model or adjust its position.\n        // For now, the logic remains but might not be visually effective.\n        this.data.playerModel.setAttribute(\"animation\", {\n          property: \"scale\",\n          to: \"1 \".concat(this.data.crouchHeight / this.data.playerHeight, \" 1\"),\n          dur: 200,\n          easing: \"easeOutQuad\"\n        });\n      }\n    }\n  },\n  onKeyUp: function onKeyUp(event) {\n    var key = event.key.toLowerCase();\n    this.keys[key] = false;\n    if (key === \"c\") {\n      this.isCrouching = false;\n      if (this.data.playerModel) {\n        this.data.playerModel.setAttribute(\"animation\", {\n          property: \"scale\",\n          to: \"1 1 1\",\n          dur: 200,\n          easing: \"easeOutQuad\"\n        });\n      }\n    }\n  },\n  remove: function remove() {\n    window.removeEventListener(\"keydown\", this.onKeyDown);\n    window.removeEventListener(\"keyup\", this.onKeyUp);\n  }\n});\n\n//# sourceURL=webpack://SWV/./src/js/swv.js?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/swv.js"]();
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});