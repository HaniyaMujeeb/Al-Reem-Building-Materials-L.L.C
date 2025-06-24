
# Al Reem Building Materials LLC Website 🚀

This repository contains the source code for the official website of **Al Reem Building Materials LLC**. It provides essential information about the company, contact details, and a Google Map integration for easy navigation.

---

## 📥 Download & Extract the ZIP Folder

1. Download the ZIP file from the source (GitHub, Google Drive, or another location).  
2. Extract the ZIP file to your desired location on your computer.  
3. Open the extracted folder in **Visual Studio Code (VS Code)** or your preferred code editor.

---

## ⚡ Install Node.js & npm (If Not Installed)

Ensure **Node.js** and **npm** (Node Package Manager) are installed on your system.  
- Download and install from [Node.js official website](https://nodejs.org/).  
- Verify installation by running the following commands in a terminal:
  ```sh
  node -v  # Check Node.js version
  npm -v   # Check npm version
  ```

---

## 📌 Install Project Dependencies

Once inside the project folder, open a terminal and run:

```sh
npm install
```

This will install all required dependencies listed in **package.json**.

---

## 🚀 Start the Development Server

To run the project locally using **Vite**, use:

```sh
npm run dev
```

This will start the development server, and the project will be available at:

```
http://localhost:5173/
```

If the browser does not open automatically, **copy and paste the URL** into your browser.

---

## 🔧 Common Issues & Fixes

1. **If `npm install` fails**  
   - Ensure you are inside the project directory before running `npm install`.  
   - Try running:  
     ```sh
     npm cache clean --force
     npm install
     ```

2. **If `npm run dev` fails**  
   - Try deleting `node_modules` and `package-lock.json`, then reinstall:
     ```sh
     rm -rf node_modules package-lock.json
     npm install
     npm run dev
     ```

---

## 🛠️ Build for Production

To create an optimized build for deployment, run:

```sh
npm run build
```

This will generate a `dist/` folder with minified files ready for production.

---

## 📄 Folder Structure

```
/al-reem-building-materials-website
│── /public       # Static files (index.html, favicon, etc.)
│── /src          # Main source code (components, styles, etc.)
│── package.json  # Project dependencies & scripts
│── README.md     # Project documentation
```






