# Basic Deployment Examples & Shared Workflow Components

This directory contains general-purpose workflow examples and shared workflow components that can be used with any Node.js application, regardless of the framework. These workflows demonstrate the core functionality of the nodejs-cpanel-deploy GitHub Action.

## Shared Workflow Components

### 1. **[deploy-workflow.yml](./deploy-workflow.yml)**
   - **Purpose**: Simple direct deployment for any Node.js application
   - **Use case**: Small projects or applications without complex staging requirements

### 2. **[rollback-workflow.yml](./rollback-workflow.yml)**
   - **Purpose**: Basic rollback capability for a single environment
   - **Use case**: Simple projects with a single deployment environment

### 3. **[environment-rollback.yml](./environment-rollback.yml)**
   - **Purpose**: Flexible rollback for any environment (development, staging, production)
   - **Use case**: Multi-environment deployment pipelines that need rollback capability
   - **Reusability**: Can be called from framework-specific workflows

### 4. **[promote-artifact.yml](./promote-artifact.yml)**
   - **Purpose**: Promote a build artifact to any environment
   - **Use case**: Multi-stage deployment pipelines (dev → staging → production)
   - **Reusability**: Works with build artifacts from any framework-specific workflow

## How to Use These Shared Components

These workflow components are designed to be used as part of a complete deployment pipeline:

1. Use a framework-specific build workflow to create an artifact (e.g., Next.js build)
2. Use `promote-artifact.yml` to deploy the artifact to staging
3. Use `promote-artifact.yml` again to deploy to production after QA
4. Use `environment-rollback.yml` if you need to roll back to a previous version

## Integration with Framework-Specific Workflows

The workflows in this directory can be combined with framework-specific build workflows from directories like:
- [Next.js Examples](../nextjs/)
- React (future addition)
- Express (future addition)

## Deployment and Rollback Architecture

All examples in this directory follow these deployment principles:

- Each deployment is created with a timestamp in the filename (e.g., `app-20230517120000.zip`)
- Deployment artifacts are preserved on the server (typically the last 3-5 deployments)
- An "active flag" file tracks which deployment is currently active
- Rollbacks are implemented by changing the active flag and restarting the application

This architecture enables:
- Quick rollbacks without rebuilding
- Deployment history tracking
- Reduced downtime during incidents

## Authentication Best Practices

Although these workflows support both SSH key and password authentication methods, we **strongly recommend using SSH key authentication** for the following reasons:

- **Security**: SSH keys are more secure than passwords and less susceptible to brute force attacks
- **Auditability**: Each deployment can use a dedicated key, making it easier to track and audit access
- **Management**: Keys can be revoked individually without affecting other credentials
- **Automation**: Keys work better in CI/CD environments without requiring manual intervention

## Prerequisites

For these workflows to function properly, your repository needs:

### Secrets (GitHub Repository Secrets)

- `CPANEL_HOST` - The hostname of your cPanel server
- `CPANEL_USERNAME` - Your cPanel username
- `CPANEL_SSH_KEY` - Your SSH private key (**strongly recommended**)
- `CPANEL_KEY_PASSPHRASE` - The passphrase for your SSH key (if applicable)

### Variables (GitHub Repository Variables)

- `APP_DIR` - The path on the server where the application will be deployed (e.g., `public_html/my-app`)
- `APP_NAME` - The name of your application for artifact naming (e.g., `my-app`) 