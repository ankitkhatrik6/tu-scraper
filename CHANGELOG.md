# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- The `useIsMobile()` hook no longer crashes when `window.matchMedia()` is unavailable; it now
  falls back to the classic `resize` listener.
- `fetchHtml()` now degrades gracefully on runtimes without the `AbortController` global (e.g.
  Node 18/19) and always enforces the configured request timeout.
- The `/api/notices` endpoint now validates the `timeout` query parameter instead of accepting
  garbage values (NaN/negative) that silently broke request timeout handling.
- The site header portal badge now shows the correct count (9) of supported portals.

### Changed

- `NoticeSource` is now derived from one canonical `NOTICE_SOURCES` list in `src/types.ts`,
  removing duplicated source lists across the package.
- Extended the test suite with edge-case regression tests (30 tests total).

## [1.2.0] - 2026-09-13

### Added

- Official Tribhuvan University central office notice source (`tu`).
- TU central listing and detail parsers with hardened title and date extraction.
- Source registry entry and playground support for the TU portal.
- Site copy updated to reflect the 9 supported portals.

### Changed

- Bumped package version to 1.2.0 and synced the lockfile.