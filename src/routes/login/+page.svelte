<script lang="ts">
    import { auth } from '$lib/stores/auth';
    import { onMount } from 'svelte';
    
    let email = '';
    let password = '';
    let error = '';
    let isLoading = false;
    let isDbConnected = false;

    async function checkDatabaseConnection() {
        try {
            const response = await fetch('/api/auth/check-connection');
            isDbConnected = (await response.json()).connected;
            if (!isDbConnected) {
                error = 'Database connection is not available';
            }
        } catch (e) {
            error = 'Unable to verify database connection';
            isDbConnected = false;
        }
    }

    async function handleSubmit() {
        isLoading = true;
        error = '';
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                await auth.login(data.user);
            } else {
                error = data.message || 'Invalid credentials';
            }
        } catch (e) {
            error = 'An error occurred. Please try again.';
            console.error('Login error:', e);
        } finally {
            isLoading = false;
        }
    }

    // Check database connection when component mounts
    onMount(checkDatabaseConnection);
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-18">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
        </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {#if !isDbConnected}
                <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span class="block sm:inline">Database connection is unavailable</span>
                </div>
            {/if}
            
            {#if error}
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span class="block sm:inline">{error}</span>
                </div>
            {/if}
            
            <form class="space-y-6" on:submit|preventDefault={handleSubmit}>
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">
                        Email address
                    </label>
                    <div class="mt-1">
                        <input
                            id="email"
                            type="email"
                            bind:value={email}
                            required
                            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <div class="mt-1">
                        <input
                            id="password"
                            type="password"
                            bind:value={password}
                            required
                            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {#if isLoading}
                            Loading...
                        {:else}
                            Sign in
                        {/if}
                    </button>
                </div>
            </form>

            <div class="mt-6 text-center">
                <a href="/register" class="text-sm text-blue-600 hover:text-blue-500">
                    Don't have an account? Register here
                </a>
            </div>
        </div>
    </div>
</div>
