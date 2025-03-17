# Next.js Deployment Examples

This directory contains example GitHub Actions workflows for deploying Next.js applications using the nodejs-cpanel-deploy GitHub Action, supporting both monorepo and single-repo architectures.

## Available Workflows

- [**Monorepo Development Build**](./monorepo-development-build.yml) - Builds and validates Next.js applications in a monorepo structure using Turborepo
- [**Single Repo Development Build**](./development-build.yml) - Builds and validates standalone Next.js applications (non-monorepo)

## Configuration Files

- [**next.config.ts**](./next.config.ts) - Example Next.js configuration for monorepo setups
- [**tsconfig.json**](./tsconfig.json) - Example TypeScript configuration for monorepo Next.js applications
- [**ecosystem.config.js**](./ecosystem.config.js) - PM2 configuration template for managing Next.js applications

> **Note on TypeScript Examples**: The TypeScript configuration files are provided as templates and may show linting errors in editors since they reference dependencies that aren't installed in this repository. These files should be used as references when setting up your own Next.js monorepo project.

## Complete Deployment Pipeline

For a complete deployment pipeline, combine these framework-specific build workflows with the shared workflows from the [basic examples](../basic/):

1. **Development Testing** - Build and validate code with [monorepo-development-build.yml](./monorepo-development-build.yml) or [development-build.yml](./development-build.yml)
2. **Staging Promotion** - Deploy to staging with [../basic/promote-artifact.yml](../basic/promote-artifact.yml)
3. **Production Deployment** - Deploy to production with [../basic/promote-artifact.yml](../basic/promote-artifact.yml)
4. **Emergency Rollbacks** - Roll back if needed with [../basic/environment-rollback.yml](../basic/environment-rollback.yml)

## Monorepo vs. Single Repo

### Monorepo Structure

The [monorepo-development-build.yml](./monorepo-development-build.yml) workflow is designed for projects using:
- PNPM as package manager
- Turborepo for monorepo management
- Shared packages across multiple applications

This approach is best for larger organizations with multiple related applications and shared components. The workflow handles the complexity of building only the necessary packages and optimizing builds with Turborepo's caching.

### Single Repo Structure

The [development-build.yml](./development-build.yml) workflow is designed for standalone Next.js applications:
- Uses NPM as the package manager
- Simpler build process
- No workspace dependencies to manage

This approach is best for smaller projects or individual applications that don't need the complexity of a monorepo setup.

## Sample Implementation

For inspiration on how to set up your own monorepo using these patterns, you can explore public monorepo examples or set up a project with Turborepo's starter templates. The deployment patterns in these examples follow best practices for Next.js applications in production environments.

## Prerequisites

For these workflows to function correctly, your repository needs:

### Secrets (GitHub Repository Secrets)

- `CPANEL_HOST` - The hostname of your cPanel server
- `CPANEL_USERNAME` - Your cPanel username
- `CPANEL_SSH_KEY` - Your SSH private key for server authentication (**strongly recommended**)
- `CPANEL_KEY_PASSPHRASE` - The passphrase for your SSH key (if applicable)
- `NEXT_PUBLIC_SITE_URL` - The URL of your Next.js application (for environment variables)

### Variables (GitHub Repository Variables)

- `APP_DIR` - The path on the server where the application will be deployed (e.g., `public_html/my-app`)
- `APP_NAME` - The name of your application for artifact naming (e.g., `my-nextjs-app`)

## Security Note

Always use SSH key authentication instead of password authentication for deployments. SSH keys provide better security, auditability, and can be revoked individually without changing the main account credentials.

## Notes

- These workflows assume your Next.js application is configured with `output: "standalone"` in next.config.js/ts
- For actual deployments, use the shared promotion workflow from the basic examples directory with SSH key authentication
- Rollbacks are implemented through the shared rollback workflow without requiring a rebuild 