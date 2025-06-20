**WARNING**: this is a WIP, just playing around to see if it can be useful. Literally no idea if it even runs yet.

# TensorBoard MCP Server

A Model Context Protocol (MCP) server that enables Claude to interact with TensorBoard, providing direct access to machine learning experiment data and metrics.

## Overview

This MCP server acts as a bridge between Claude and TensorBoard, allowing you to:

- Query experiment metrics and visualizations through natural language
- Compare training runs and analyze performance
- Access scalar metrics, histograms, and other TensorBoard data
- Automate experiment analysis workflows

## Features

### 🔍 **Experiment Discovery**

- List all available runs and experiments
- Filter experiments by name or pattern
- Quick overview of your training landscape

### 📊 **Metrics Analysis**

- **Scalars**: Access loss, accuracy, learning rates, and custom metrics
- **Histograms**: Analyze weight and gradient distributions
- **Comparisons**: Side-by-side metrics comparison across multiple runs with statistical summaries

### 🛡️ **Production-Ready**

- **Robust Error Handling**: Specific error types for different failure modes
- **Input Validation**: Zod-based schema validation for all inputs
- **Retry Logic**: Automatic retries for transient failures
- **Structured Logging**: Winston-based logging with proper log levels

### 🏗️ **Clean Architecture**

- Modular design with separation of concerns
- Service layer for business logic
- Dedicated API client for TensorBoard communication
- Type-safe throughout with TypeScript

### 🤖 **Claude Integration**

- Natural language queries about your experiments
- Automated insights and anomaly detection
- Training progress summaries and recommendations

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/tensorboard-mcp.git
cd tensorboard-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

## Configuration

1. Copy the environment template:

   ```bash
   cp .env.example .env
   ```

2. Configure your TensorBoard URL in `.env`:

   ```
   TENSORBOARD_URL=http://localhost:6006
   ```

3. Ensure TensorBoard is running:
   ```bash
   tensorboard --logdir=/path/to/your/logs
   ```

## Usage

### Starting the Server

```bash
npm start
```

For development with hot reload:

```bash
npm run dev
```

### Claude Desktop Integration

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "tensorboard": {
      "command": "node",
      "args": ["/absolute/path/to/tensorboard-mcp/dist/index.js"],
      "env": {
        "TENSORBOARD_URL": "http://localhost:6006"
      }
    }
  }
}
```

## Available Tools

### `list-runs`

Lists all available TensorBoard runs/experiments.

**Parameters:**

- `experiment` (optional): Filter by experiment name or regex pattern

**Example:** "Show me all experiments from today"

### `get-scalars`

Retrieves scalar metrics for a specific run.

**Parameters:**

- `run` (required): The run ID or path
- `tag` (optional): Specific metric name (e.g., "loss", "accuracy")

**Example:** "What's the final validation accuracy for run_2024_01_15?"

### `get-histograms`

Accesses histogram data for weights and gradients.

**Parameters:**

- `run` (required): The run ID or path
- `tag` (optional): Specific histogram tag

**Example:** "Show me the weight distribution for the final layer"

### `compare-runs`

Compares metrics across multiple runs.

**Parameters:**

- `runs` (required): Array of run IDs
- `metric` (required): The metric to compare

**Example:** "Compare the loss curves between my last three experiments"

## Example Conversations

```
You: "What experiments did I run yesterday?"
Claude: [Uses list-runs to find experiments] I found 3 experiments from yesterday...

You: "How does the learning rate affect the convergence?"
Claude: [Uses compare-runs] Comparing the loss curves across different learning rates...

You: "Is my model overfitting?"
Claude: [Uses get-scalars] Looking at training vs validation metrics...
```

## Development

### Project Structure

```
tensorboard-mcp/
├── src/
│   ├── api/              # TensorBoard API client
│   │   └── TensorBoardClient.ts
│   ├── config/           # Configuration management
│   │   └── index.ts
│   ├── errors/           # Custom error types
│   │   └── TensorBoardError.ts
│   ├── services/         # Business logic layer
│   │   └── RunService.ts
│   ├── tools/            # MCP tool implementations
│   │   ├── listRuns.ts
│   │   ├── getScalars.ts
│   │   ├── compareRuns.ts
│   │   └── index.ts
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/            # Utilities
│   │   └── logger.ts
│   ├── validation/       # Input validation schemas
│   │   └── schemas.ts
│   └── index.ts          # Main server entry point
├── dist/                 # Compiled JavaScript
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── .env.example          # Environment template
```

### Building from Source

```bash
npm run build
```

### Testing

```bash
npm test
```

## Troubleshooting

### Common Issues

1. **Connection refused**: Ensure TensorBoard is running on the configured port
2. **No runs found**: Check that your log directory contains valid TensorBoard logs
3. **Tool errors**: Verify the TensorBoard HTTP API is accessible

### Debug Mode

Set debug logging in your environment:

```bash
DEBUG=tensorboard-mcp npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Acknowledgments

Built with the [Model Context Protocol SDK](https://modelcontextprotocol.io/) by Anthropic.
