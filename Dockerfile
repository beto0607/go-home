FROM golang:1.24 AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o ./my-app .

FROM alpine
COPY --from=build /app/my-app .
RUN apk add --no-cache libc6-compat
EXPOSE 8979
CMD ["./my-app"]
