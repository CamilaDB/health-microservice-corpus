import { Project, SourceFile } from "ts-morph";
import path from "path";
import { CORPUS_ROOT } from "./config";

/**
 * Creates a ts-morph Project pointed at the corpus tsconfig.
 * All source file paths will be absolute under CORPUS_ROOT.
 */
export function createProject(): Project {
  return new Project({
    tsConfigFilePath: path.join(CORPUS_ROOT, "tsconfig.json"),
    skipFileDependencyResolution: false,
  });
}

/**
 * Returns all service source files from the corpus.
 * Filters to *.service.ts — the only layer that contains business logic
 * and is therefore the target for test generation.
 */
export function loadServiceFiles(project: Project): SourceFile[] {
  return project
    .getSourceFiles()
    .filter((sf) => sf.getFilePath().endsWith(".service.ts"));
}
