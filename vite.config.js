export default {
  build: {
    rollupOptions: {
      input: {
        home: "/index.html", // your main entry point
        wallet: "/assets/pages/wallet/wallet.html",
        control: "/assets/pages/control/control.html", // path to your other pages
        backup: "/assets/pages/backup/nostrdb/index.html",
        wallet: "/assets/pages/wallet/wallet.html",
        
        // add more entries for additional pages as needed
      },
    },
  },
};
