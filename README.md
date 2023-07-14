## Installation Guide - Frontend Shortlink App

This guide provides instructions on how to install and set up the frontend for the Shortlink App. The frontend is built with Vue.js 3 and requires Node.js## Installation Guide - Frontend Shortlink App

This guide provides instructions on how to install and set up the frontend for the Shortlink App. The frontend is built with Vue.js 3 and requires Node.js, npm, and Vue.js to be installed on your system.

### Prerequisites
- Node.js v14.21.3
- npm v8.19.3
- Vue.js v3.3.4

### Installation Steps

1. Clone the Frontend Repository:

```terminal
git clone https://github.com/Zadelkhair/shorter-fe.git
```

3. Change to the Frontend directory:

```terminal
cd shorter-fe
```

5. Install the Dependencies:

```
npm install
```

7. Configure the Backend Endpoint:
- Open the `/src/config.js` file in your preferred text editor.
- Locate the `SERVER_ENDPOINT` variable and replace `"the backend url"` with the URL of your backend server. For example:

  ```javascript
  export const SERVER_ENDPOINT = "http://localhost:8000";
  ```
  Replace `"http://localhost:8000"` with the actual URL of your backend server.

5. Install and Set Up the Backend:
- Follow the instructions in the [Shortlink Backend Repository](https://github.com/Zadelkhair/shorter-be) to install and set up the backend server.

6. Run the Frontend in Development Mode:

```
npm run dev
```

This command starts the development server for the frontend. You should now be able to access the Shortlink App in your web browser at `http://localhost:8080`.

7. Build for Production:
If you want to deploy the frontend in a production environment, you need to build the project. Run the following command:

```
npm run build
```

This command generates the optimized production-ready files in the `dist` directory.

You can then deploy the contents of the `dist` directory to your web server or hosting service.

Congratulations! You have successfully installed and set up the Shortlink App frontend. You can now start using the app to shorten your long links.

Note: Make sure to have the backend server running and configured correctly for the app to function properly.

If you have any further questions or issues, please let me know., npm, and Vue.js to be installed on your system.

