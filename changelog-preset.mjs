import gitmoji from 'conventional-changelog-gitmoji-config';

const preset = gitmoji.default ?? gitmoji;

export default async function createPreset() {
  return {
    parser: await preset.parserOpts,
    writer: await preset.writerOpts,
  };
}
