---
name: senangwebs-verse
description: A-Frame component for 3rd person player controls in WebXR/3D scenes with WASD movement, jump, crouch, and animation switching.
version: 1.0.3
package: senangwebs-verse
---

# SenangWebs Verse (SWV)

## Quick Reference

- **Purpose**: 3rd person player controller component for A-Frame scenes
- **Source**: `src/js/swv.js`
- **Distribution**: `dist/swv.js`
- **Runtime dependencies**: A-Frame v1.5.0+ and aframe-extras
- **Scripts**: `npm run build`, `npm run dev`

## Workflow

Start in `C:\wamp64\www\sw-libraries\senangwebs-verse`. Read `README.md`, `package.json`, and touched source files. Match existing patterns. After source changes, rebuild `dist/swv.js`. Verify the A-Frame scene loads and the player moves.

## HTML Data Attribute

```html
<a-entity data-swv-player="cameraRig: #rig; playerModel: #model;
  animWalking: walk; animIdle: idle; speed: 5.0;
  crouchSpeed: 2.5; jumpForce: 8.0; gravity: -19.6;
  playerHeight: 1.8; crouchHeight: 1.0"></a-entity>
```

## Configuration Options

| Option | Type | Default | Description |
|---|---|---|---|
| `cameraRig` | selector | `#camera-rig` | Camera rig element |
| `playerModel` | selector | `#player-model-entity` | Player model element |
| `animWalking` | string | `walking` | Walking animation name |
| `animIdle` | string | `idle` | Idle animation name |
| `speed` | number | `5.0` | Movement speed |
| `crouchSpeed` | number | `2.5` | Movement speed while crouching |
| `jumpForce` | number | `8.0` | Jump impulse force |
| `gravity` | number | `-19.6` | Gravity acceleration |
| `playerHeight` | number | `1.8` | Standing height (meters) |
| `crouchHeight` | number | `1.0` | Crouching height (meters) |

## Controls

| Key | Action |
|---|---|
| W/A/S/D | Move forward/left/back/right |
| Space | Jump |
| C (hold) | Crouch |

## Focus Areas

- 3rd person camera following the player model
- WASD movement relative to camera facing direction
- Jump impulse, ground detection, and gravity integration
- Crouch height, model scale, and reduced movement speed
- Walking/idle animation transitions based on movement state
- Player model rotation toward movement direction
- Runtime integration with A-Frame and aframe-extras

## Implementation Guidance

- Preserve backward compatibility for all configuration option names.
- Treat A-Frame and aframe-extras as runtime dependencies; they are not bundled.
- Apply `animation-mixer` only when the animation clip changes. Reapplying it every tick resets work in aframe-extras.
- Test movement responsiveness, animation transitions, and listener cleanup.
- Verify jump ground detection and prevent unintended double jumps.
- Test with different player model scales and animation clip names.

## Validation

```bash
npm run build
npm run dev
```

`npm test` is currently a placeholder and exits with an error.
