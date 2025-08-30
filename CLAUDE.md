# winrmctl Development Guidelines

## Dev environment tips
- Use `bun run dev` to test CLI commands during development without building
- Run `bun build src/cli.ts --outdir dist --target node` to create production build
- Test installed CLI with `bun run dist/cli.js` after building
- Use `bun test` to run all tests - tests should pass before committing
- Check TypeScript types with `bun run typecheck` to catch type errors early

## Testing instructions
- Run `bun test` to execute all test suites
- Use `bun test --watch` for test-driven development
- Run `bun run lint` to check ESLint rules before committing
- Execute `bun run typecheck` to verify TypeScript types
- Format code with `bun run format` to maintain consistent style
- All tests must pass before merging any changes

## Code quality checks
- Always run `bun run lint` and `bun run typecheck` before committing
- Fix any linting or type errors before pushing code
- Use `bun run format` to auto-format code according to project standards
- Keep command files focused and under 200 lines
- Break complex logic into separate utility modules

## PR instructions
- Title format: feat: <description> or fix: <description>
- Always run `bun run lint`, `bun run typecheck`, and `bun test` before committing
- Ensure all UI components follow the established design system in src/utils/ui.ts
- Test CLI commands manually with `bun run dev` before submitting PR
- Update relevant documentation if adding new commands or options