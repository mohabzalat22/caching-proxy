# Cache Proxy CLI
Project From: https://roadmap.sh/projects/caching-server
A command-line HTTP caching proxy server built with Node.js that forwards requests to an origin server and caches responses to improve performance.

## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Commands](#commands)
- [Examples](#examples)

## ✨ Features

- **HTTP Proxy Server**: Forwards requests to a configured origin server
- **Response Caching**: Caches responses using a custom HashMap implementation
- **Cache Headers**: Returns `X-Cache: HIT` or `X-Cache: MISS` headers
- **Interactive CLI**: Built-in command-line interface for managing the cache
- **Secure Hashing**: Uses HMAC-SHA256 for generating cache keys
- **Environment Configuration**: Supports `.env` file configuration

## 🚀 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cache_proxy_cli
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
touch .env
```

4. Add your secret key to the `.env` file:
```env
secret=your-secret-key-here
```

5. (Optional) Install globally:
```bash
npm link
```

## 📖 Usage

### Start the Proxy Server

```bash
node index.js --port <port> --origin <origin-url>
```

Or if installed globally:

```bash
caching-proxy --port <port> --origin <origin-url>
```

how to install globally:

```bash
npm install -g
```

### Parameters

- `--port`: The port number where the proxy server will run (required)
- `--origin`: The origin server URL to forward requests to (required)

### Example

```bash
node index.js --port 8000 --origin http://dummyjson.com
```

Then make requests to:
```bash
curl http://localhost:8000/products/1
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file with the following variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `secret` | Secret key for HMAC hashing of cache keys | Yes |

### Example `.env` file:
```env
secret=my-super-secret-key-123
```

## 🏗️ Architecture

### Project Structure

```
cache_proxy_cli/
├── index.js                 # Main server file
├── package.json            # Project configuration
├── readme.md              # Documentation
└── utils/
    ├── generateKey.js     # HMAC key generation
    ├── hashmap.js         # Custom HashMap implementation
    └── message.js         # Response message formatters
```

### Core Components

#### 1. **index.js** - Main Server

The entry point of the application that:
- Creates an HTTP server using Node.js built-in `http` module
- Handles incoming requests and forwards them to the origin server
- Manages cache hits and misses
- Provides an interactive CLI for cache management

**Key Functions:**
- Request handling and proxying
- Cache lookup and storage
- Response header management (`X-Cache: HIT/MISS`)
- Interactive command-line interface

#### 2. **utils/hashmap.js** - HashMap Class

A custom HashMap implementation for caching responses.

**Class: `HashMap`**

```javascript
constructor()
```
Initializes an empty records array for storing cached data.

```javascript
hash(key: string): string
```
- Generates a secure hash for the given key using HMAC-SHA256
- Throws error if `secret` environment variable is not set
- Throws error if key is empty

```javascript
set(key: string, value: any): void
```
- Stores a key-value pair in the cache
- Prevents duplicate entries by checking if key exists

```javascript
get(key: string): any
```
- Retrieves a value from the cache by key
- Returns `undefined` if key doesn't exist

```javascript
clear(): void
```
- Clears all cached entries

**Class: `Record`**

Internal class for storing key-value pairs:
```javascript
constructor(key: string, value: any)
```

#### 3. **utils/generateKey.js** - Key Generation

**Function: `generateKey(secret, message)`**

Generates a secure HMAC-SHA256 hash for cache keys.

**Parameters:**
- `secret` (string): Secret key for HMAC
- `message` (string): The message to hash (typically the URL)

**Returns:**
- (string): Hexadecimal hash string

**Example:**
```javascript
const hash = generateKey("my-secret", "/api/users");
// Returns: "a1b2c3d4e5f6..."
```

#### 4. **utils/message.js** - Response Formatters

**Function: `successMessage(statusCode, success, message, data)`**

Formats successful API responses.

**Parameters:**
- `statusCode` (number): HTTP status code (default: 200)
- `success` (boolean): Success flag (default: true)
- `message` (string): Success message (default: "success message")
- `data` (array): Response data (default: [])

**Returns:**
```javascript
{
  success: boolean,
  statusCode: number,
  message: string,
  data: any
}
```

**Function: `errorMessage(statusCode, success, message, errors)`**

Formats error API responses.

**Parameters:**
- `statusCode` (number): HTTP status code (default: 400)
- `success` (boolean): Success flag (default: false)
- `message` (string): Error message (default: "error message")
- `errors` (array): Error details (default: [])

**Returns:**
```javascript
{
  success: boolean,
  statusCode: number,
  message: string,
  errors: any
}
```

## 🎮 Commands

Once the server is running, you can use the following interactive commands:

| Command | Description |
|---------|-------------|
| `cache-proxy --clear-cache` | Clear all cached entries |
| `cache-proxy -h` | Show help message |
| `cache-proxy --help` | Show help message |
| `exit` or `quit` | Exit the application |

### Command Usage

```bash
# Clear the cache
> cache-proxy --clear-cache

# Show help
> cache-proxy -h

# Exit the application
> exit
```

## 📝 Examples

### Example 1: Basic Usage

Start the server:
```bash
node index.js --port 3000 --origin http://dummyjson.com
```

Make a request (first time - cache MISS):
```bash
curl -i http://localhost:3000/products/1
# X-Cache: MISS
```

Make the same request again (cache HIT):
```bash
curl -i http://localhost:3000/products/1
# X-Cache: HIT
```

### Example 2: Clear Cache

```bash
# In the server terminal:
> cache-proxy --clear-cache
Cleared cached entries
```

### Example 3: Response Format

**Cache MISS Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "success fetch from origin server",
  "data": {
    "id": 1,
    "title": "Product Name",
    ...
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "HTTP Error status: 404",
  "errors": []
}
```

## 🔒 Security

- Cache keys are hashed using HMAC-SHA256 with a secret key
- Ensure your `.env` file is included in `.gitignore`
- Never commit your secret key to version control

## 🛠️ Development

Run in development mode with auto-reload:

```bash
npm run dev
```

## 📦 Dependencies

- **dotenv**: Environment variable management
- **nodemon** (dev): Auto-reload during development

## 🐛 Troubleshooting

### "SECRET environment variable is not set"
- Ensure you have created a `.env` file in the root directory
- Add `secret=your-secret-key` to the `.env` file

### "please use --origin and --port to run server"
- Both `--origin` and `--port` flags are required
- Example: `node index.js --port 3000 --origin http://example.com`

### Cache not clearing
- Use the correct command: `cache-proxy --clear-cache`
- Ensure you're typing in the interactive prompt, not a new terminal

## 📄 License

ISC

## 👤 Author

Mohab Ali

---

**Note**: This is a learning project for understanding HTTP proxies and caching mechanisms.
