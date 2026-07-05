---
title: Infrastructure
description: Servers and networking overview
---

The homelab runs on two physical hosts.

## Hosts

- **Pi** — Raspberry Pi, runs lightweight services
- **OptiPlex** — Debian 13, main workhorse on VLAN 30

Both hosts run Docker Compose stacks and are backed up via [Backups](/docs/backups).

## Networking

Traffic is routed through Cloudflare tunnels. Services are listed in [Services](/docs/services).
