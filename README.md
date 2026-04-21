# Drop

A local network file sharing app. Run it on one machine, access it from any device on the same WiFi — phones, laptops, tablets, anything with a browser.

Built with Spring Boot + React.

---

## What it does

- Upload files from any device on the network
- See all uploaded files in one place
- Download or delete files from any device
- No internet required, everything stays local

---

## How it works

The React frontend is built and served as static files directly by Spring Boot. This means the whole app runs on a single port (`8080`) — no separate dev server, no CORS gymnastics. Once the app is running, any device on the same network can reach it at:

```
http://<your-machine-hostname>:8080
```

---

## Running the app

A `.bat` file is included at the root of the project. Double-click it and it starts the Spring Boot backend via `./mvnw spring-boot:run`. Everything runs from there.

To find your hostname or local IP on Windows:

```
ipconfig
```

Look for **IPv4 Address** under your WiFi adapter, e.g. `192.168.1.5`. Then open `http://192.168.1.5:8080` on any other device.

---

## Building the frontend

If you make changes to the React source, rebuild it and copy the output into Spring Boot's static folder:

```bash
cd frontend
npm run build
```

Then copy the contents of `frontend/build` into `src/main/resources/static`.

---

## Project structure

```
├── src/
│   ├── main/
│   │   ├── java/          # Spring Boot backend
│   │   └── resources/
│   │       └── static/    # Built React frontend served here
├── frontend/              # React source
├── start.bat              # Double-click to run the app
└── README.md
```

---

## Storage

Uploaded files are saved to a local folder on the host machine. The path is configured in `StorageProperties`:


`server.address=0.0.0.0` in `applciation.properties` is what makes the app reachable across the network instead of just on localhost.

---

## Built with

- [Spring Boot](https://spring.io/projects/spring-boot)
- [React](https://react.dev)
- [styled-components](https://styled-components.com)
