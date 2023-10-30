/** @param {NS} ns */
export async function main(ns) {
  let servers = ns.scan();
  let availablePorts = 0;
  let ram;
  let useRam = ns.getScriptRam("hack.js");
  let threads = 0;
  let maxRam;
  for (let i = 0; i < servers.length; i++) {//loop thru all the servers
    maxRam = ns.getServerMaxRam(servers[i]);
    ram = maxRam - ns.getServerUsedRam(servers[i]);//get amount of unused ram on server
    if (ram > ns.getScriptRam("spread.js")+ns.getScriptRam("hack.js")) {//check if the server has enough ram
      if (servers[i] != "home") {
        ns.scp("spread.js", servers[i]);//copy the spread file to the server

        ns.scp("hack.js", servers[i]);//copy the hack file to the server

        if (!ns.hasRootAccess(servers[i])) {//get root access
          if (ns.fileExists("BruteSSH.exe", "home")) {//check which ports we can open
            availablePorts++;
            ns.brutessh(servers[i]);
          }
          if (ns.fileExists("FTPCrack.exe", "home")) {
            availablePorts++;
            ns.ftpcrack(servers[i]);
          }
          if (ns.fileExists("relaySMTP.exe", "home")) {
            availablePorts++;
            ns.relaysmtp(servers[i]);
          }
          if (ns.fileExists("HTTPWorm.exe", "home")) {
            availablePorts++;
            ns.httpworm(servers[i]);
          }
          if (ns.fileExists("SQLInject.exe", "home")) {
            availablePorts++;
            ns.sqlinject(servers[i]);
          }
          ns.nuke(servers[i]);
        }
        ns.exec("spread.js", servers[i]);//spread
        ram = maxRam - ns.getServerUsedRam(servers[i]);//get amount of unused ram on server
        threads = Math.floor(ram / useRam);//get amount of threads we can run
        ns.exec("hack.js", servers[i], threads)//run the hack
      }
    }
    await ns.sleep(1000);
  }
}
