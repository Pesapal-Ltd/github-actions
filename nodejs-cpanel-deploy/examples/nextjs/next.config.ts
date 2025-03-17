import path from "node:path";
import type { NextConfig } from "next";

/**
 * Example Next.js configuration for monorepo setups using the nodejs-cpanel-deploy action
 * 
 * This configuration includes:
 * - Remote image patterns for various environments
 * - Transpilation of internal packages
 * - ESLint configuration for CI/CD
 * - Standalone output for improved deployment
 * - Proper file tracing for monorepo setups
 */
const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{ hostname: "localhost" },
			{ hostname: "example.com" },
			{ hostname: "staging.example.com" },
			{ hostname: "images.example.com" },
		],
	},
	transpilePackages: ["@repo/emails"],
	eslint: {
		ignoreDuringBuilds: true,
	},
	output: "standalone",
	// this includes files from the monorepo base two directories up
	outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig; 