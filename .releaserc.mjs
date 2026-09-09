import { semanticRelease } from '@lobehub/lint';

// Single-package repo: no scope filtering, no monorepo plugin. `tagFormat`
// stays at the semantic-release default (`v${version}`), continuing from the
// `v1.2.0` tag that carries over the version already on npm.
export default semanticRelease;
