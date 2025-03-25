# Reusable GitHub Actions (WIP you have been warned)

This repository contains a collection of reusable GitHub Actions that can be used across different projects.

## Philosophy

### Why This Exists

Deployment should never be a bottleneck in your development process. Manual deployments are not only time-consuming but also error-prone and introduce unnecessary security risks. This collection of GitHub Actions was created to automate deployment processes, ensuring consistency, security, and efficiency.

### Recommended Deployment Pipeline

We recommend implementing a multi-stage deployment pipeline with proper gates between environments:

1. **Development Testing**

   - On every push to the `development` branch (or via manual trigger)
   - Run a test build to verify that the code builds successfully
   - Implement branch protection rules that prevent merging PRs into `development` if the test build fails
   - Store artifacts for potential promotion to staging

2. **Staging Promotion**

   - When merging from `development` to `staging`
   - Retrieve the most recent successful development build
   - Deploy to staging environment for thorough testing
   - This ensures the exact build that was tested is what moves forward

3. **Production Deployment**
   - Only after QA approval of the staging environment
   - When merging from `staging` to `main`/`master`
   - Create a fresh build with production-specific environment variables
   - Deploy to production using the same automated process

This pipeline ensures code is thoroughly tested at each stage while maintaining efficiency through build artifact reuse where appropriate.

### Workflow Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│  Feature    │────▶│ Development │────▶│  Staging    │────▶│ Production  │
│  Branch     │     │  Branch     │     │  Branch     │     │ Branch      │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                          │                   │                   │
                          ▼                   ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
                    │   Test      │     │ Deploy from │     │   Fresh     │
                    │   Build     │     │ Dev Artifact│     │   Build     │
                    │   Workflow  │     │ Workflow    │     │   Workflow  │
                    └─────────────┘     └─────────────┘     └─────────────┘
                          │                   │                   │
                          ▼                   ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
                    │ Store Build │     │   Deploy    │     │   Deploy    │
                    │  Artifact   │     │ to Staging  │     │to Production│
                    │             │     │  Servers    │     │   Servers   │
                    └─────────────┘     └─────────────┘     └─────────────┘
```

**Branch Protection Rules:**

- PRs to `development`: Must pass test build
- PRs to `staging`: Must be from `development`
- PRs to `main`: Must be from `staging` and have QA approval

### Deployment Artifact Management & Rollbacks

A robust deployment system must plan for failures. Our deployment actions incorporate these principles:

1. **Artifact Retention**

   - The most recent 3-5 deployment artifacts (configurable) are preserved on the server
   - Each artifact is a complete, timestamped snapshot of the application
   - This creates a historical record and enables quick rollbacks

2. **Active Deployment Tracking**

   - An "active flag" file (e.g., `active-{appname}`) is maintained on the server
   - This file contains the timestamp of the currently active deployment
   - The system uses this flag to identify which deployment is currently running

3. **Quick Rollbacks**
   - To rollback, simply point the active flag to a previous deployment artifact
   - Restart the application using the previous artifact
   - No need to rebuild or redeploy in an emergency

This architecture significantly reduces recovery time during incidents. Instead of rushing to fix code and redeploy (which can lead to more errors), teams can immediately rollback to the last known good state and then diagnose the issue at an appropriate pace.

### Security First

Security should never be compromised for convenience:

- **Always use SSH keys** instead of username/password authentication
- **Password-protect your SSH keys** for an additional layer of security
- Store sensitive information as GitHub Secrets, never hardcode them
- Use GitHub Variables for non-sensitive configuration values
- Implement least-privilege access principles for deployment credentials

### Performance Optimization

Efficient CI/CD pipelines save both time and money:

- **Caching is critical** - Implement aggressive caching strategies for dependencies
- For monorepos, use tools like Turborepo to only build what's changed
- Optimize Docker layers if using containerized deployments
- Use incremental builds where possible

### Continuous Improvement

A deployment pipeline should evolve with your project:

- Regularly review and update your workflows
- Monitor deployment times and look for optimization opportunities
- Collect metrics on deployment frequency and success rates
- Automate rollbacks for quick recovery from failed deployments

By following these principles, you can create a deployment process that enhances your development workflow rather than hindering it.

## Available Actions

### [Node.js cPanel Deploy](./nodejs-cpanel-deploy)

This action deploys a Node.js application to a cPanel server using SSH and starts PM2 processes.

```yaml
- name: Deploy to cPanel
  uses: Pesapal-Ltd/github-actions/nodejs-cpanel-deploy@main
  with:
    app_name: "your-app-name"
    timestamp: ${{ steps.timestamp.outputs.timestamp }}
    host: ${{ secrets.CPANEL_HOST }}
    username: ${{ secrets.CPANEL_USERNAME }}
    ssh_key: ${{ secrets.CPANEL_SSH_KEY }}
    key_passphrase: ${{ secrets.CPANEL_KEY_PASSPHRASE }}
    # Optional advanced customization
    app_dir: "~/custom/path"
    nodejs_path: "/custom/node/path"
    package_manager: "npm" # npm, yarn, pnpm, or bun
    use_pm2: "true"
    pm2_config_path: "ecosystem.config.js"
    cleanup_old_deployments: "true"
    keep_deployments: "5"
```

## How to Use These Actions

1. Add the action to your workflow file:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      # Example for Node.js cPanel Deploy
      - name: Deploy to cPanel
        uses: Pesapal-Ltd/github-actions/nodejs-cpanel-deploy@main
        with:
          # Required inputs for the action
```

2. Configure the required secrets in your repository:

   - Go to your repository settings
   - Select "Secrets and variables" → "Actions"
   - Add the necessary secrets (e.g., `CPANEL_HOST`, `CPANEL_USERNAME`, `CPANEL_SSH_KEY`)

3. Ensure your workflow meets the prerequisites for the action you're using.

## Sample Workflows

Each action directory contains example workflow files in an 'examples' subdirectory:

### Node.js cPanel Deploy Examples

#### Basic Examples

- [Basic Node.js Deployment](./nodejs-cpanel-deploy/examples/basic/deploy-workflow.yml)

#### Next.js Monorepo Examples

- [Next.js Development Build](./nodejs-cpanel-deploy/examples/nextjs/development-build.yml)
- [Next.js Production Build and Deploy](./nodejs-cpanel-deploy/examples/nextjs/production-build-and-deploy.yml)
- [Next.js PM2 Configuration](./nodejs-cpanel-deploy/examples/nextjs/ecosystem.config.js)

**Note:** The Next.js examples are specifically designed for monorepo setups using PNPM and Turborepo.

## Contributing

1. Fork this repository
2. Create a new branch for your changes
3. Submit a pull request with your improvements

## License

MIT
