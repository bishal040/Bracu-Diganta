---
title: "Designing the SIGMA Active Guidance System for TEKNOFEST 2026"
slug: "designing-sigma-active-guidance-teknofest-2026"
subtitle: "Stability-Integrated Guidance Mechanical Actuator Architecture"
excerpt: "An inside look at how BRACU Diganta engineered a dual-stage model satellite payload capable of autonomous mechanical actuation, active descent stabilization, and real-time video telemetry."
date: "2026-08-14"
author: "Avionics & GNC Division"
authorRole: "Flight Control & Embedded Systems"
category: "Avionics & GNC"
tags: ["TEKNOFEST 2026", "SIGMA", "Active Guidance", "Flight Control", "Telemetry"]
coverImage: "https://i.ibb.co.com/9k2RzPY7/Whats-App-Image-2026-06-17-at-01-47-41-1.jpg"
readTime: "6 MIN READ"
featured: true
recordId: "LOG-SIGMA-01"
status: "PUBLISHED"
specs:
  - label: "Release Altitude"
    value: "1,500 – 1,800 Meters"
  - label: "Separation Threshold"
    value: "1,000 Meters AGL"
  - label: "Control Loop Rate"
    value: "250 Hz PID Actuation"
  - label: "Downlink Link"
    value: "Dual-Band RF + Video"
gallery:
  - "https://i.ibb.co.com/Ndzxfmbc/Whats-App-Image-2026-06-17-at-01-47-42-1.jpg"
  - "https://i.ibb.co.com/wh0nz9mJ/Whats-App-Image-2026-06-17-at-01-47-44-2.jpg"
  - "https://i.ibb.co.com/8DKLyHWS/Whats-App-Image-2026-06-17-at-01-47-35-1.jpg"
  - "https://i.ibb.co.com/KxThc0hN/Whats-App-Image-2026-06-17-at-01-47-36-1.jpg"
---

## Mission Architecture Overview

Advancing to the Project Design Review (PDR) stage of **TEKNOFEST 2026** required rethinking how a sub-kilogram model satellite handles atmospheric disturbances during high-altitude descent. Under the **Stability-Integrated Guidance Mechanical Actuator (SIGMA)** framework, our payload must execute a two-stage deployment profile: separating from its protective container at **1,000 meters** and transitioning into an actively stabilized descent regime.

Unlike passive parachute-only recovery architectures, SIGMA incorporates an active mechanical actuator coupled with a propulsion-assisted descent module. This ensures attitude stabilization while maintaining continuous line-of-sight video and sensor telemetry with the ground station.

![SIGMA Prototype Integration](https://i.ibb.co.com/Ndzxfmbc/Whats-App-Image-2026-06-17-at-01-47-42-1.jpg)

## Sensor Fusion & Attitude Estimation

At the core of the SIGMA flight computer is a high-frequency sensor fusion pipeline running on an ARM Cortex-M7 microcontroller. During freefall and container separation, high-G shear forces and aerodynamic buffeting introduce significant noise into raw accelerometer readings.

To achieve sub-degree orientation accuracy, our embedded firmware combines:

- **9-DOF Inertial Measurement Unit (IMU):** Sampling tri-axial gyroscope and accelerometer telemetry at `500 Hz` via SPI.
- **Barometric Altimeter & Differential Pressure:** Providing vertical velocity estimation and deployment altitude triggers with `±0.15 m` vertical resolution.
- **Extended Kalman Filter (EKF):** Fusing inertial attitude quaternions with barometric vertical rate and 10Hz GNSS position vectors.

```cpp
// Simplified Attitude Control Loop (250 Hz Task)
void updateGuidanceActuators(const Quaternion& q_est, const Vector3f& gyro_rad) {
    EulerAngles attitude = quaternionToEuler(q_est);
    float rollError  = TARGET_ROLL  - attitude.roll;
    float pitchError = TARGET_PITCH - attitude.pitch;

    // Cascaded PID with derivative-on-measurement to prevent kick
    float actuatorCmdX = pidRoll.compute(rollError, -gyro_rad.x, DT_SEC);
    float actuatorCmdY = pidPitch.compute(pitchError, -gyro_rad.y, DT_SEC);

    gimbalDrive.setDeflectionAngles(actuatorCmdX, actuatorCmdY);
}
```

## Two-Stage Separation & Recovery Protocol

The mission timeline is governed by an autonomous finite state machine (FSM) stored in non-volatile FRAM so that even a transient brownout cannot reset the flight state mid-descent:

1. **LAUNCH_PAD_IDLE:** Low-power telemetry beacon (`0.2 Hz`), waiting for launch rail acceleration spike (`> 3.5 G`) and barometric climb confirmation.
2. **ASCENT_PHASE:** High-rate onboard SD logging enabled; apogee detection monitors vertical velocity zero-crossing.
3. **CONTAINER_DESCENT:** Primary stabilization drogue deployed at apogee (`1,500–1,800 m`), maintaining controlled descent toward the separation ceiling.
4. **PAYLOAD_SEPARATION:** At `1,000 m AGL`, the nichrome burn-wire and cam-lock release mechanism frees the Science Payload, engaging the active mechanical actuator and propulsion descent system.
5. **TOUCHDOWN_RECOVERY:** Upon detecting zero vertical velocity and low angular variance for `3 seconds`, telemetry continues for `10 seconds` before cutting motor power and triggering the `95 dB` acoustic recovery beacon.

> "Integrating active mechanical guidance into a compact satellite envelope forced our mechanical and avionics divisions to co-design every millimeter of the internal bay. Every gram saved in the structure went directly into actuator torque margin." — BRACU Diganta Avionics Lead

![Avionics Bay Testing](https://i.ibb.co.com/wh0nz9mJ/Whats-App-Image-2026-06-17-at-01-47-44-2.jpg)

## Next Steps Toward Flight Readiness

With the PDR milestone cleared, our focus now shifts to closed-loop wind-tunnel characterization and drop-tower validation at BRAC University. Full-scale RF range tests for the simultaneous HD video and telemetry downlink are scheduled for next month.

