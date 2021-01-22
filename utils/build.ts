import * as ts from 'typescript';

export const build = (core: string): Promise<string> => {
  return new Promise((resolve) => {
    const options: ts.CompilerOptions = {
      module: ts.ModuleKind.None,
      target: ts.ScriptTarget.ES3,
      downlevelIteration: true,
      strict: true,
      alwaysStrict: true,
    };
    const result = ts.transpileModule(core, {
      compilerOptions: options,
    });
    return resolve(result.outputText);
  });
};
