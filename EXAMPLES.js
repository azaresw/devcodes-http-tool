/**
 * DevCodes - Usage Examples
 * 
 * This file demonstrates common usage patterns for the DevCodes HTTP client.
 */

// Import DevCodes
import devcodes, { create } from "./dist/index.js";

// Example 1: Basic GET request
async function basicGet() {
  try {
    const response = await devcodes.get("/api/users");
    console.log("Users:", response.data);
    console.log("Status:", response.status);
  } catch (error) {
    console.error("Failed to fetch users:", error.message);
  }
}

// Example 2: POST request with data
async function createUser() {
  try {
    const response = await devcodes.post("/api/users", {
      name: "John Doe",
      email: "john@example.com",
    });
    console.log("Created user:", response.data);
  } catch (error) {
    console.error("Failed to create user:", error.message);
  }
}

// Example 3: Create custom client instance
async function customInstance() {
  const client = create({
    baseURL: "https://api.example.com",
    timeout: 10000,
    headers: {
      Authorization: "Bearer your-token-here",
    },
  });

  try {
    const response = await client.get("/api/protected-data");
    console.log("Data:", response.data);
  } catch (error) {
    console.error("Request failed:", error.message);
  }
}

// Example 4: Request with parameters
async function withParameters() {
  try {
    const response = await devcodes.get("/api/users", {
      params: {
        page: 1,
        limit: 10,
        sort: "name",
      },
    });
    console.log("Users:", response.data);
  } catch (error) {
    console.error("Failed to fetch:", error.message);
  }
}

// Example 5: Request interceptors
async function withInterceptors() {
  const client = create();

  // Add request interceptor
  client.requestInterceptors.use(
    (config) => {
      console.log("Making request to:", config.url);
      // Add authentication header
      config.headers = {
        ...config.headers,
        Authorization: "Bearer token123",
      };
      return config;
    },
    (error) => {
      console.error("Request error:", error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  client.responseInterceptors.use(
    (response) => {
      console.log("Response received:", response.status);
      return response;
    },
    (error) => {
      console.error("Response error:", error);
      return Promise.reject(error);
    }
  );

  try {
    const response = await client.get("/api/data");
    console.log("Data:", response.data);
  } catch (error) {
    console.error("Failed:", error.message);
  }
}

// Example 6: Error handling
async function errorHandling() {
  try {
    const response = await devcodes.get("/api/non-existent", {
      validateStatus: (status) => status < 500, // Only fail on server errors
    });

    if (response.status >= 400) {
      console.log("Client error:", response.status);
    }
  } catch (error) {
    if (error.isDevCodesError) {
      console.error("Code:", error.code);
      console.error("Message:", error.message);
      if (error.response) {
        console.error("Status:", error.response.status);
      }
    }
  }
}

// Example 7: Timeout handling
async function withTimeout() {
  try {
    const response = await devcodes.get("/api/slow-endpoint", {
      timeout: 5000, // 5 seconds
    });
    console.log("Success:", response.data);
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      console.log("Request timed out!");
    }
  }
}

// Example 8: PUT and DELETE
async function putAndDelete() {
  try {
    // Update user
    const updateResponse = await devcodes.put("/api/users/123", {
      name: "Jane Doe",
      email: "jane@example.com",
    });
    console.log("Updated:", updateResponse.data);

    // Delete user
    const deleteResponse = await devcodes.delete("/api/users/123");
    console.log("Deleted:", deleteResponse.status);
  } catch (error) {
    console.error("Operation failed:", error.message);
  }
}

// Run examples (uncomment to test)
// basicGet();
// createUser();
// customInstance();
// withParameters();
// withInterceptors();
// errorHandling();
// withTimeout();
// putAndDelete();

console.log("✅ DevCodes examples loaded!");
