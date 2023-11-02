/** @param {NS} ns */
export async function main(ns) {
  let serverGigs = ns.args[0];
  let servers = ns.getPurchasedServers().length;
  let ramUsage = ns.getScriptRam("hack.js");
  while (true) {
    if (ns.getServerMoneyAvailable("home") > 55000 * serverGigs) {
      ns.purchaseServer("server" + servers, serverGigs);
      ns.scp("hack.js", "server" + servers);
      ns.exec("hack.js", "server" + servers, Math.floor(serverGigs / ramUsage));
      ns.tprint(serverGigs + "gb server bought");
      servers++;
    }
    await ns.sleep(1000);
  }
} 
