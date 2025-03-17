# Example Workflows for cPanel Deployment

This directory contains example workflows that demonstrate how to use the nodejs-cpanel-deploy action in different scenarios.

## Example Categories

1. [**Basic Examples**](./basic/) - Reusable deployment patterns for any Node.js application
   - [Basic deployment workflow](./basic/deploy-workflow.yml) - Simple Node.js app deployment
   - [Simple rollback workflow](./basic/rollback-workflow.yml) - Basic rollback for a single environment
   - [Environment rollback workflow](./basic/environment-rollback.yml) - Advanced rollback for any environment
   - [Artifact promotion workflow](./basic/promote-artifact.yml) - Promote artifacts between environments

2. [**Next.js Examples**](./nextjs/) - Next.js application workflows
   - [Monorepo development build](./nextjs/monorepo-development-build.yml) - Build & validate code for monorepo
   - [Single repo development build](./nextjs/development-build.yml) - Build & validate standalone Next.js apps
   - [Configuration examples](./nextjs/) - next.config.ts, tsconfig.json, and ecosystem.config.js examples

## Workflow Organization Philosophy

Our workflow organization follows these principles:

1. **Separation of Concerns**
   - **Framework-specific build workflows** are kept in framework folders (e.g., Next.js)
   - **Generic deployment workflows** are kept in the basic folder and can be reused
   
2. **Reusable Components**
   - The build process for different project structures is specific to the framework/architecture
   - The deployment and rollback processes are mostly identical across frameworks
   - By separating these concerns, we enable maximum reusability

3. **Complete Pipeline**
   - The complete deployment pipeline combines framework-specific build workflows with generic deployment workflows
   - For example: Next.js build workflow + generic promotion workflow + generic rollback workflow

## Multi-Stage Deployment Pipeline

Our examples demonstrate a recommended multi-stage deployment pipeline:

1. **Development Testing** - Build and validate code, create artifact
   - Framework-specific build workflow (e.g., [nextjs/monorepo-development-build.yml](./nextjs/monorepo-development-build.yml))

2. **Staging Promotion** - Deploy development artifact to staging for QA
   - Generic promotion workflow ([basic/promote-artifact.yml](./basic/promote-artifact.yml))

3. **Production Deployment** - Deploy to production after QA approval
   - Generic promotion workflow with production environment

4. **Emergency Rollbacks** - Quick restoration of service without rebuilding
   - Generic rollback workflow ([basic/environment-rollback.yml](./basic/environment-rollback.yml))

## Deployment and Rollback Architecture

All example workflows follow these deployment principles:

- Each deployment is created with a timestamp in the filename (e.g., `app-20230517120000.zip`)
- Deployment artifacts are preserved on the server (typically the last 3-5 deployments)
- An "active flag" file tracks which deployment is currently active
- Rollbacks are implemented by changing the active flag and restarting from a previous artifact

This architecture enables:
- Quick rollbacks without rebuilding
- Deployment history tracking
- Reduced downtime during incidents

## Security Best Practices

All workflows support both SSH key and password authentication, but we **strongly recommend**:

- Always use SSH key authentication instead of password authentication
- Set up dedicated deployment keys with limited permissions for each environment
- Use passphrase-protected SSH keys for an additional layer of security
- Store SSH keys and passphrases securely in GitHub Secrets

## Usage Notes

- All examples assume you have the necessary secrets configured in your repository
- The Next.js monorepo examples are specifically designed for PNPM and Turborepo setups
- The Next.js single repo examples work with standard NPM/Yarn projects
- The basic examples can be adapted for any Node.js application

For more details, see the README file in each example category directory. 