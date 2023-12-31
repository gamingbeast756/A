 /** @param {NS} ns */
export async function main(ns) {
  let servers = ns.scan();
  let availablePorts = 0;
  let ram;
  let threads = 0;
  let maxRam;
  let spreadFile="spread.js";
  let hackFile="hack.js";
  let useRam = ns.getScriptRam(hackFile);
  for (let i = 0; i < servers.length; i++) {//loop thru all the servers
    maxRam = ns.getServerMaxRam(servers[i]);
    ram = maxRam - ns.getServerUsedRam(servers[i]);//get amount of unused ram on server
    if (ram > ns.getScriptRam(spreadFile)+ns.getScriptRam(hackFile)) {//check if the server has enough ram
      if (servers[i] != "home") {
        ns.scp(spreadFile, servers[i]);//copy the spread file to the server

        ns.scp(hackFile, servers[i]);//copy the hack file to the server

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
          try{
            ns.nuke(servers[i]);
          }catch(exception){}
        }
        ns.exec(spreadFile, servers[i]);//spread
        ram = maxRam - ns.getServerUsedRam(servers[i]);//get amount of unused ram on server
        threads = Math.floor(ram / useRam);//get amount of threads we can run
        ns.exec(hackFile, servers[i], threads)//run the hack
      }
    }
    await ns.sleep(1000);
  }
}
