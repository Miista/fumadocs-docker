---
title: Backups
description: Backup strategy and recovery
---

All data is backed up with restic to three destinations: local disk, Cloudflare R2, and BorgBase.

## Hosts

Both [Infrastructure](/docs/infrastructure) hosts run their own restic profiles independently.

## Destinations

| Destination | Retention | Notes |
|-------------|-----------|-------|
| Local disk | 7 daily | Fast recovery |
| Cloudflare R2 | 30 daily | Off-site |
| BorgBase | 90 daily | Off-site, deduplicated |

## Recovery

See the RESTORE.md in R2 for step-by-step recovery instructions. Services that need restoring are listed in [Services](/docs/services).
