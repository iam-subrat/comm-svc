# Communication Service Project

This project implements a communication service using Docker Compose, consisting of three main services: `comm-gateway`, `persist-worker`, and `sender-worker`. Each service is responsible for different aspects of the communication workflow.

## Project Structure

```
comm-docker-compose-project
├── comm-gateway
│   ├── src
│   │   └── index.js          # Entry point for the comm-gateway service
│   ├── package.json          # Configuration and dependencies for comm-gateway
│   └── Dockerfile            # Dockerfile for building the comm-gateway image
├── persist-worker
│   ├── src
│   │   └── index.js          # Entry point for the persist-worker service
│   ├── package.json          # Configuration and dependencies for persist-worker
│   └── Dockerfile            # Dockerfile for building the persist-worker image
├── sender-worker
│   ├── src
│   │   └── index.js          # Entry point for the sender-worker service
│   ├── package.json          # Configuration and dependencies for sender-worker
│   └── Dockerfile            # Dockerfile for building the sender-worker image
├── docker-compose.yml        # Docker Compose configuration for all services
└── README.md                 # Project documentation
```

## Setup Instructions

1. **Clone the Repository**
   Clone this repository to your local machine.

2. **Navigate to the Project Directory**
   ```bash
   cd comm-docker-compose-project
   ```

3. **Build the Docker Images**
   Use Docker Compose to build the images for all services:
   ```bash
   docker-compose build
   ```

4. **Run the Services**
   Start the services using Docker Compose:
   ```bash
   docker-compose up
   ```

5. **Access the API**
   The `comm-gateway` service exposes an API endpoint at `POST /communication`. You can send requests to this endpoint to publish messages to Kafka.

## Usage

- **comm-gateway**: This service handles incoming API requests and publishes messages to the Kafka topic `communication.raw`.
- **persist-worker**: This service consumes messages from the `communication.raw` topic, processes them, and saves the data to a Postgres database. It also produces messages to the `communication.ready` topic after saving.
- **sender-worker**: This service listens to the `communication.ready` topic, processes the messages, and sends them via various channel adapters (Email, SMS, Webhook, Slack). It updates the database status and the `sent_at` timestamp.

## Additional Information

- Ensure that Docker and Docker Compose are installed on your machine.
- Modify the environment variables in the `docker-compose.yml` file as needed for your setup.
- Refer to the individual service directories for specific implementation details and dependencies.