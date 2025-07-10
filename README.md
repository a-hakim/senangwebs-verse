# SenangWebs Verse (SWV)

SenangWebs Verse (SWV) is a lightweight A-Frame component for creating 3rd person player controls in WebXR and 3D web scenes. It provides smooth movement, jumping, crouching, and animation switching for your player model, making it easy to build interactive 3D experiences.

## Features

- Simple 3rd person player movement (WASD)
- Jump and crouch support
- Smooth camera follow
- Animation switching (idle, walking)
- Model rotation based on movement direction
- Easy integration with A-Frame scenes
- Customizable movement speed, jump force, and player height

## Example

See a live example in the [`examples/index.html`](examples/index.html) file.

## Installation

### Using a CDN

Include the SWV script in your HTML file:

```html
<script src="path/to/swv.js"></script>
```

Or use a relative path if you cloned/downloaded this repo:

```html
<script src="../dist/swv.js"></script>
```

### Requirements

- [A-Frame](https://aframe.io/) (v1.5.0+)
- [aframe-extras](https://github.com/c-frame/aframe-extras) (for animation-mixer)

## Usage

1. **Add the SWV script and dependencies to your HTML:**

```html
<script src="https://aframe.io/releases/1.7.0/aframe.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/c-frame/aframe-extras@7.6.0/dist/aframe-extras.min.js"></script>
<script src="../dist/swv.js"></script>
```

2. **Set up your A-Frame scene and assets:**

```html
<a-assets>
  <a-asset-item id="player-model" src="./robot.glb"></a-asset-item>
</a-assets>
```

3. **Add the player entity and camera rig:**

```html
<a-entity
  id="player"
  scale="0.5 0.5 0.5"
  data-swv-player="animWalking: RobotArmature|Robot_Walking; animIdle: RobotArmature|Robot_Idle; playerHeight: 1; speed: 3; crouchHeight: 0.8; jumpForce: 8;"
>
  <a-entity
    id="player-model-entity"
    gltf-model="#player-model"
    modify-materials
  ></a-entity>
</a-entity>

<a-entity
  id="camera-rig"
  position="0 0 0"
  look-controls="pointerLockEnabled: true; reverseMouseDrag: false; touchEnabled: false;"
>
  <a-camera
    id="camera"
    position="0 1.6 3"
    fov="90"
    wasd-controls-enabled="false"
  ></a-camera>
</a-entity>
```

4. **Add a ground plane and environment:**

```html
<a-plane
  position="0 0 0"
  rotation="-90 0 0"
  width="100"
  height="100"
  material="color: #7BC8A4; roughness: 0.8;"
></a-plane>
<a-sky color="#AED7E0"></a-sky>
<a-light type="ambient" color="#888"></a-light>
<a-light type="directional" intensity="0.8" position="-1 1 2"></a-light>
```

## Configuration Options

You can configure the player component via the `data-swv-player` attribute:

| Option         | Type     | Default   | Description                                      |
| -------------- | -------- | --------- | ------------------------------------------------ |
| cameraRig      | selector | #camera-rig | Selector for the camera rig entity              |
| playerModel    | selector | #player-model-entity | Selector for the player model entity      |
| animWalking    | string   | walking   | Animation clip name for walking                  |
| animIdle       | string   | idle      | Animation clip name for idle                     |
| speed          | number   | 5.0       | Walking speed                                    |
| crouchSpeed    | number   | 2.5       | Speed while crouching                            |
| jumpForce      | number   | 8.0       | Upward velocity for jump                         |
| gravity        | number   | -19.6     | Gravity applied to the player                    |
| playerHeight   | number   | 1.8       | Standing player height                           |
| crouchHeight   | number   | 1.0       | Height while crouching                           |

Example:

```html
<a-entity
  data-swv-player="animWalking: RobotArmature|Robot_Walking; animIdle: RobotArmature|Robot_Idle; playerHeight: 1; speed: 3; crouchHeight: 0.8; jumpForce: 8;"
>
  ...
</a-entity>
```

## Controls

- **WASD**: Move player
- **Space**: Jump (if not crouching)
- **C**: Crouch (hold to crouch, release to stand)

## Animation

The component uses the `animation-mixer` system from aframe-extras to switch between idle and walking animations based on movement. You can specify the animation clip names via the `animWalking` and `animIdle` options.

## Browser Support

SenangWebs Verse works on all modern browsers that support A-Frame and WebGL, including:

- Chrome
- Firefox
- Safari
- Edge

## Contributing

Contributions are welcome! Please submit a Pull Request or open an issue.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [A-Frame](https://aframe.io/) and [aframe-extras](https://github.com/c-frame/aframe-extras)
- Model and animation credits: Quaternius ([poly.pizza](https://poly.pizza/))

