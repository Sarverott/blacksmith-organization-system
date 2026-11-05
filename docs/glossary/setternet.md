# Setternet

> DRAFT. Short: snet.

## What it is

The network of BOS hosts belonging to one owner. Every host has a
[workshop](workshop.md), and each workshop has a [role](host-role.md) in the
setternet. The setternet provides the connectivity gateways between them.

## Why it exists

Work happens on many machines (desktop, laptop, servers, VMs). The setternet
turns them into one system: each host does its part, and they stay in sync
instead of drifting apart.

## Where

Each workshop's place in the setternet is defined in `.BOS/setup/setternet/`
(older top-level `.SETTERNET`).

## Contains

- hosts, each with one workshop and one role
- connectivity gateways
- integrators: extensions of programs acting as setternet clients with API
  presets (Thunderbird, Chrome, Codium, git / GitPython / Octokit / Husky,
  GIMP, OBS), and procedural wrappers or macro bridges around tools (adb,
  Flipper Zero, GitHub workflow generator, Docker, Arduino)

## Rules

Exactly one host per setternet is the *canon monolith*.

## Open questions

- Transport: VPN, SSH, bos-server? (see `.BOS/setup/`) [`TODO`]
