const { BrowserWindow } = require("electron");

// eslint-disable-next-line no-unused-vars
const template = [
  {
    label: "File",
    submenu: [
      {
        label: "Backup",
      },
    ],
  },
  {
    label: "Profile",
    click() {
      const modalPath =
        process.env.NODE_ENV === "development"
          ? "http://localhost:9080/#/report"
          : `file://${__dirname}/index.html#report`;
      let win = new BrowserWindow({
        width: 400,
        height: 320,
        webPreferences: { webSecurity: false },
      });
      win.on("close", function() {
        win = null;
      });
      win.loadURL(modalPath);
    },
  },
  {
    label: "Help",
    role: "Help",
    submenu: [
      {
        label: "Learn More",
        click() {
          require("electron").shell.openExternal("http://electron.atom.io");
        },
      },
    ],
  },
];

// const menu = Menu.buildFromTemplate(template)
// Menu.setApplicationMenu(menu)
