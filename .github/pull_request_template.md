## Summary

A concise summary of the changes proposed in this pull request.

## Motivation & Context

Why is this change required? What problem does it solve?
- Relates to issue #[issue-number] (if applicable)

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature or audio preset / tool (non-breaking change adding functionality)
- [ ] Audio DSP algorithm refinement / optimization
- [ ] Documentation update or correction
- [ ] CI / Build / Workflow enhancement
- [ ] Breaking change (fix or feature that would cause existing functionality to change)

## Testing Performed

Describe how you tested these changes:
- [ ] `npm test` passed locally (`vitest run` — all suites passing)
- [ ] `npx tsc --noEmit` passed (no type errors)
- [ ] `npm run lint` passed (no ESLint errors)
- [ ] `npx tsx scripts/verify-audio.ts` passed (DSP math validations)
- [ ] `npm run build` succeeded
- [ ] Tested real-time audio playback & export download in modern browser (Chrome / Firefox / Safari)

## Audio DSP & Headroom Verification (For DSP changes)

- [ ] Verified signal does not hard-clip above 0 dBFS (-0.3 dBFS safety ceiling respected)
- [ ] Verified non-destructive behavior (dry audio unchanged when bypassed)
- [ ] Accompanied by unit test in `src/lib/audio/__tests__/`

## Checklist

- [ ] My code follows the project's coding conventions and guidelines
- [ ] I have updated relevant documentation in `docs/` where appropriate
- [ ] No private secrets, credentials, or personal files are committed

