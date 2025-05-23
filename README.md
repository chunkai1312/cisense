# CISense

> CISense is a visual analysis platform for Corporate Identity Systems (CIS) that leverages AI to quickly evaluate whether an image aligns with brand identity guidelines, providing scores and actionable suggestions for improvement.

## Prerequisites

- Install [Docker](https://www.docker.com/)
- Apply for an [OpenAI API Key](https://platform.openai.com/signup/)

## Quick Start

The quickest way to get started is by using `docker-compose`:

```yml
services:
  cisense:
    image: chunkai1312/cisense:latest
    restart: always
    container_name: cisense
    ports:
      - "3000:3000"
    environment:
      - CIS_NAME=
      - CIS_LOGO_PATH=
      - CIS_FILE_PATH=
      - MONGODB_URI=
      - QDRANT_URL=
      - OPENAI_API_KEY=
    volumes:
      - ./cis:/app/cis
    depends_on:
      - mongo
      - qdrant
  mongo:
    image: mongo:latest
    restart: always
    container_name: mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
  qdrant:
    image: qdrant/qdrant:latest
    restart: always
    container_name: qdrant
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - qdrant_data:/qdrant/storage

volumes:
  mongo_data:
  qdrant_data:
```

To start the services, run:

```bash
docker-compose up -d
```

Once the services are running, open your browser and visit `http://localhost:3000`.

## Environment Variables

The following environment variables are required to configure the system:

- `CIS_NAME`: The name of your CIS project. Example: `MyCISProject`.
- `CIS_LOGO_PATH`: The file path to your CIS logo. Example: `/path/to/logo.png`.
- `CIS_FILE_PATH`: The file path to your CIS documentation. Example: `/path/to/cis-document.pdf`.
- `MONGODB_URI`: The connection string for MongoDB. Example: `mongodb://localhost:27017/cisense`.
- `QDRANT_URL`: The URL for the Qdrant vector database service. Example: `http://localhost:6333`.
- `OPENAI_API_KEY`: Your OpenAI API key for accessing AI services. Obtain it from [OpenAI](https://platform.openai.com/signup).

Ensure all required variables are set in your `.env` file before starting the application.

## License

[MIT](LICENSE)
