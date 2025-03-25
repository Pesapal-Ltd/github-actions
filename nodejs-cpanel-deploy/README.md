# Node.js cPanel Deploy Action

This GitHub Action deploys a Node.js application to a cPanel server and manages PM2 processes for reliable Node.js application hosting. It supports multiple package managers, custom Node.js paths, and flexible deployment configurations.

## Deployment Philosophy

Manual deployments to cPanel servers are tedious, error-prone, and create unnecessary security risks. This action was created to solve these challenges by providing an automated, secure deployment process for Node.js applications running on cPanel servers.

### Why Automate cPanel Deployments?

- **Eliminate Manual Steps**: Manually building, zipping, transferring, extracting, and restarting services is time-consuming and error-prone.
- **Enhance Security**: Use SSH key authentication for secure, auditable, and manageable deployments.
- **Ensure Consistency**: Every deployment follows exactly the same steps, eliminating human errors.
- **Save Time**: Focus on development rather than deployment logistics.

### Recommended Implementation

For the most efficient development workflow with cPanel deployments, we recommend:

1. **Implement a Test Build Workflow** that runs on every push to development
   - This verifies code can be built successfully before it's considered for staging
   - Use branch protection to prevent merging to development if tests fail

2. **Implement a Promotion Workflow** for staging
   - Reuse successful development builds for staging deployments
   - This ensures the exact code that was tested is what moves to staging

3. **Create Production Deployments** from validated staging artifacts
   - Promote thoroughly tested staging builds to production
   - Maintain deployment history for quick rollbacks if needed

This approach provides the right balance between efficiency (reusing builds where appropriate) and reliability (preserving deployment history for rollbacks).

## Prerequisites

- A zipped Node.js application with an `ecosystem.config.js` file for PM2 (optional if not using PM2)
- SSH access to a cPanel server
- An SSH private key for secure authentication (strongly recommended)

## Usage

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      # Previous steps to build and zip your application
      
      - name: Generate timestamp
        id: timestamp
        run: echo "timestamp=$(date +'%Y%m%d%H%M%S')" >> $GITHUB_OUTPUT
      
      - name: Deploy to cPanel
        uses: Pesapal-Ltd/nodejs-cpanel-deploy@v1
        with:
          app_name: "your-app-name"
          package_path: "./your-app-name-${{ steps.timestamp.outputs.timestamp }}.zip"
          timestamp: ${{ steps.timestamp.outputs.timestamp }}
          host: ${{ secrets.CPANEL_HOST }}
          username: ${{ secrets.CPANEL_USERNAME }}
          ssh_key: ${{ secrets.CPANEL_SSH_KEY }}
          key_passphrase: ${{ secrets.CPANEL_KEY_PASSPHRASE }}
          auth_method: ssh_key  # Strongly recommended
          # Optional customizations
          app_dir: "~/repositories"
          nodejs_path: "/opt/cpanel/ea-nodejs18/bin"
          package_manager: "npm"
          use_pm2: "true"
          pm2_config_path: "ecosystem.config.js"
          cleanup_old_deployments: "true"
          keep_deployments: "5"
          pnpm_path: "/path/to/compatible/pnpm" # Optional: only if default pnpm has issues
```

## Example Workflows

We provide several example workflows organized by use case:

### Shared Workflow Components
- [Basic Deployment](./examples/basic/deploy-workflow.yml) - Simple direct deployment
- [Simple Rollback](./examples/basic/rollback-workflow.yml) - Basic rollback for a single environment
- [Environment Rollback](./examples/basic/environment-rollback.yml) - Advanced rollback for any environment
- [Artifact Promotion](./examples/basic/promote-artifact.yml) - Deploy artifacts to any environment

### Framework-Specific Workflows
- [Next.js Monorepo Build](./examples/nextjs/monorepo-development-build.yml) - Specialized for Next.js monorepo builds
- [Next.js Single Repo Build](./examples/nextjs/development-build.yml) - For standalone Next.js applications

See the [examples directory](./examples/) for more information on our workflow organization philosophy and complete implementation patterns.

## Inputs

| Input                   | Description                                 | Required | Default                     |
|-------------------------|---------------------------------------------|----------|----------------------------|
| `app_dir`               | Root directory on cPanel server             | No       | `~/repositories`           |
| `app_name`              | Your application name                       | Yes      | -                          |
| `package_path`          | Path to the zipped application              | Yes (for deploy) | -                 |
| `timestamp`             | Timestamp for the deployment                | Yes      | -                          |
| `host`                  | Hostname or IP of the cPanel server         | Yes      | -                          |
| `username`              | cPanel username                             | Yes      | -                          |
| `password`              | cPanel password (for password auth)         | For password auth | -               |
| `ssh_key`               | SSH private key (for SSH key auth)          | For SSH key auth | -                |
| `key_passphrase`        | Passphrase for the SSH key                  | No       | -                          |
| `auth_method`           | `ssh_key` or `password`                     | Yes      | `ssh_key`                  |
| `operation`             | `deploy` or `rollback`                      | No       | `deploy`                   |
| `rollback_timestamp`    | Timestamp to roll back to                   | For rollbacks | -                     |
| `nodejs_path`           | Path to Node.js installation on server      | No       | `/opt/cpanel/ea-nodejs18/bin` |
| `package_manager`       | Package manager (npm, yarn, pnpm, bun)      | No       | `npm`                      |
| `use_pm2`               | Whether to manage app with PM2              | No       | `true`                     |
| `pm2_config_path`       | Path to PM2 config file                     | No       | `ecosystem.config.js`      |
| `cleanup_old_deployments` | Whether to delete old deployment packages | No       | `false`                    |
| `keep_deployments`      | Number of recent deployments to keep        | No       | `5`                        |
| `pnpm_path`             | Path to a custom pnpm installation          | No       | `""`                       |

## New Customization Features

### Package Manager Support
The action now supports multiple package managers:
- **npm**: Standard Node.js package manager
- **yarn**: Fast, reliable alternative to npm
- **pnpm**: Disk space efficient package manager (requires Node.js ≥ 14)
- **bun**: Ultra-fast JavaScript runtime and package manager

> **Note about pnpm compatibility**: Modern versions of pnpm require Node.js 14 or later. If your cPanel server runs an older version, you can either:
> 1. Set a custom pnpm path with the `pnpm_path` parameter
> 2. The action will automatically fall back to npm if pnpm is incompatible
> 3. Consider using npm or yarn instead if upgrading Node.js is not an option

### Node.js Path Customization
You can now specify a custom path to your Node.js installation:
- Useful for environments with multiple Node.js versions
- Makes the action compatible with non-standard cPanel setups
- Default is set to cPanel's EA-NodeJS 18 path
- **Improved Implementation**: The action now automatically adds the Node.js path to the `PATH` environment variable, similar to how it would be done in `.bashrc`, making all Node.js binaries available without specifying full paths

### PM2 Management (Optional)
PM2 management can now be disabled if you're using another process manager:
- Set `use_pm2: "false"` to skip PM2-related operations
- Useful if you're using systemd, Forever.js, or other process managers
- When disabled, the action will only deploy files without managing processes

### Custom PM2 Configuration Path
You can specify a custom path to your PM2 ecosystem config:
- Default is `ecosystem.config.js` in your application root
- Allows for environment-specific PM2 configurations
- Action will attempt to use package.json start script if the config file is not found

### Deployment Cleanup
The action now supports automatic cleanup of old deployment packages:
- Enable with `cleanup_old_deployments: "true"`
- Control how many recent deployments to keep with `keep_deployments` (default: 5)
- Oldest deployments will be removed first
- Active deployment is always protected from cleanup
- Helps manage disk space on the server by removing unnecessary old deployment packages

## Authentication Methods

This action supports two authentication methods:

### SSH Key Authentication (Recommended)
- **More secure**: Private keys are not transmitted during authentication
- **Better auditing**: Individual keys can be tracked and managed
- **Revocability**: Individual keys can be revoked without affecting other access
- **Required inputs**: `ssh_key` and optionally `key_passphrase`

### Password Authentication (Not Recommended)
- **Less secure**: Passwords are more vulnerable to various attacks
- **Limited auditing**: Password usage is harder to track
- **Required inputs**: `password`

We strongly recommend using SSH key authentication for all deployments.

## How It Works

1. The action copies the zipped application to the cPanel server
2. Extracts the application to the proper directory
3. Installs production dependencies using the specified package manager
4. Sets an active flag to indicate the current deployment
5. Optionally restarts the PM2 processes if PM2 management is enabled

## Artifact Management and Rollbacks

This action implements a robust deployment artifact management system that enables quick rollbacks in case of issues:

### Preserved Deployment Artifacts

- The action preserves deployment artifacts (as zip files) on the server
- Each artifact is stored with a timestamp-based name: `{app_name}-{timestamp}.zip`
- These artifacts serve as complete snapshots of each deployment

### Active Deployment Tracking

- For each application, an "active flag" file is maintained: `active-{app_name}`
- This file contains the name of the currently active deployment zip file
- The PM2 process uses this flag to determine which deployment is active

### Implementing Rollbacks

To roll back to a previous deployment, you can:

1. Use the built-in rollback operation by setting `operation: rollback` and providing `rollback_timestamp`
2. Or use the example [environment-rollback.yml](./examples/basic/environment-rollback.yml) workflow

The rollback process:
1. Updates the active flag to point to a previous deployment
2. Extracts the previous deployment artifact
3. Restarts the application with PM2 (if enabled)
4. All without requiring a rebuild

## Complete Deployment Pipeline

For a recommended complete deployment pipeline that separates concerns:

1. **Development Testing**: Framework-specific build workflow (e.g., Next.js)
2. **Staging Promotion**: Shared promotion workflow to deploy to staging
3. **Production Deployment**: Shared promotion workflow to deploy to production
4. **Emergency Rollbacks**: Shared rollback workflow for any environment

This approach separates framework-specific build processes from generic deployment logic for maximum reusability

## Security Best Practices

When using this action, follow these security best practices:

1. **Use SSH key authentication** rather than password authentication
2. **Create dedicated deployment keys** with limited permissions
3. **Use passphrase protection** for your SSH keys
4. **Store all credentials in GitHub Secrets**, never in plaintext in your workflows
5. **Use different keys for different environments** to limit the impact of a compromised key 