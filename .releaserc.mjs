import { semanticRelease } from '@lobehub/lint';

const GITMOJI_PRESET = './changelog-preset.mjs';

const plugins = semanticRelease.plugins.map((plugin) => {
  if (!Array.isArray(plugin)) return plugin;
  const [name, options] = plugin;
  if (
    options?.config === 'conventional-changelog-gitmoji-config' &&
    (name === '@semantic-release/commit-analyzer' ||
      name === '@semantic-release/release-notes-generator')
  ) {
    return [name, { ...options, config: GITMOJI_PRESET }];
  }
  return plugin;
});

export default { ...semanticRelease, plugins };
