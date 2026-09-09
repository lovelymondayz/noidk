# Build stage
FROM golang:1.25-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -mod=vendor -o /noidk-backend .

# Run stage
FROM alpine:3.19
WORKDIR /app

RUN apk add --no-cache ca-certificates && adduser -D -u 1000 noidk

COPY --from=builder /noidk-backend .

# Create uploads directory
RUN mkdir -p /app/uploads && chown -R noidk:noidk /app

USER noidk

EXPOSE 8085

CMD ["./noidk-backend"]
