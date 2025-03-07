import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	// Fix for potential HMR issues
	server: {
		hmr: {
			clientPort: process.env.HMR_HOST ? 443 : 24678,
			host: process.env.HMR_HOST ? process.env.HMR_HOST.substring('https://'.length) : 'localhost'
		}
	},
	// Improve build performance
	build: {
		reportCompressedSize: false,
		chunkSizeWarningLimit: 1000,
		// Enable this if you have mysterious memory issues
		// minify: 'terser',
		// terserOptions: {
		//   compress: {
		//     passes: 2
		//   }
		// }
	}
});
