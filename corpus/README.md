# Corpus

This directory contains the target NestJS application used as the evaluation corpus for the experimental pipeline.

## Purpose

The corpus is the service under test. It provides the production-like Application Under Test (AUT) used to generate, repair and evaluate unit tests with LLMs.

## Domain

The service implements a health microservice covering:

- patient management
- encounters
- orders
- results
- health-check endpoints

## Structure

The codebase is organized by domain module under `src/`.

## Role in the project

This project is not a general backend application by itself; it is the test subject of the experiment.

The runner and AST extraction pipeline depend on the corpus for:

- source code to analyze
- method bodies to generate tests around
- service files and test spec paths
- bootstrap and metadata generation

## Notes

The corpus is intentionally treated as a fixed experimental subject. It supplies the input data for the LLM-driven test generation workflow.
