module.exports = {
	apps: [
		{
			name: "nextjs-app",
			script: "apps/web/server.js",
			env: {
				NODE_ENV: "production",
				// App secrets (replace with actual values during deployment)
				APP_SECRET: "{{APP_SECRET}}",
				NEXT_PUBLIC_URL: "{{NEXT_PUBLIC_URL}}",
				DATABASE_URL: "{{DATABASE_URL}}",
				
				// Authentication configuration
				AUTH_CLIENT_ID: "{{AUTH_CLIENT_ID}}",
				AUTH_CLIENT_SECRET: "{{AUTH_CLIENT_SECRET}}",
				AUTH_DISCOVERY_URL: "{{AUTH_DISCOVERY_URL}}",
				
				// External service configuration
				SERVICE_API_URL: "{{SERVICE_API_URL}}",
				SERVICE_API_USER: "{{SERVICE_API_USER}}",
				SERVICE_API_KEY: "{{SERVICE_API_KEY}}",
				
				// Optional feature flags
				ENABLE_FEATURE_X: "{{ENABLE_FEATURE_X}}",
			},
		},
	],
}; 