import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
	serverExternalPackages: ['@node-rs/argon2', 'argon2'],
	webpack: (config) => {
		config.resolve.alias = {
			...config.resolve.alias,
			'@': path.resolve(__dirname, 'src'),
			'@lib': path.resolve(__dirname, 'src/lib'),
			'@models': path.resolve(__dirname, 'src/lib/models'),
			'@schemas': path.resolve(__dirname, 'src/lib/schemas'),
			'@actions': path.resolve(__dirname, 'src/lib/actions'),
			'@contexts': path.resolve(__dirname, 'src/app/contexts')
		};
		return config;
	},
};

export default nextConfig;
