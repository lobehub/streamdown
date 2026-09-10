import gitmoji from 'conventional-changelog-gitmoji-config';

const preset = gitmoji.default ?? gitmoji;

export default async function createPreset() {
  const writer = { ...(await preset.writerOpts) };
  const transform = writer.transform;
  writer.transform = (commit, context) =>
    transform(
      {
        ...commit,
        notes: commit.notes.map((note) => ({ ...note })),
        references: commit.references.map((ref) => ({ ...ref })),
      },
      context,
    );

  return {
    parser: await preset.parserOpts,
    writer,
  };
}
