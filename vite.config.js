export default {
  build: {
    rollupOptions: {
      input: {
        home: "index.html", // your main entry point
        control: "/assets/pages/control/control.html", // path to your other pages
        backup: "/assets/pages/backup/backup.html",
        wallet: "/assets/pages/wallet/wallet.html",
        // add more entries for additional pages as needed
      },
    },
  },
};
