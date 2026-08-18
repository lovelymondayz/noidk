# Build stage
FROM golang:1.22-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /noidk-backend .

# Run stage
FROM alpine:3.19
WORKDIR /app

RUN apk add --no-cache ca-certificates
COPY --from=builder /noidk-backend .

# Create uploads directory
RUN mkdir -p /app/uploads

EXPOSE 8085
CMD ["./noidk-backend"]
