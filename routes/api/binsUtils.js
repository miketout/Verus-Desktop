const os = require('os');
const fsnode = require('fs');
const _fs = require('graceful-fs');
const { DAEMON_NAMES } = require('./utils/constants');
const exec = require('child_process').exec;

module.exports = (api) => {
  api.killRogueProcess = (processName) => {
    // kill rogue process copies on start
    const osPlatform = os.platform();
    let processGrep;

    switch (osPlatform) {
      case 'darwin':
        processGrep = "ps -p $(ps -A | grep -m1 " + processName + " | awk '{print $1}') | grep -i " + processName;
        break;
      case 'linux':
        processGrep = 'ps -p $(pidof ' + processName + ') | grep -i ' + processName;
        break;
      case 'win32':
        processGrep = 'tasklist';
        break;
    }

    exec(processGrep, (error, stdout, stderr) => {
      if (stdout.indexOf(processName) > -1) {
        const pkillCmd = osPlatform === 'win32' ? `taskkill /f /im ${processName}.exe` : `pkill -15 ${processName}`;

        api.log(`found another ${processName} process(es)`, 'native.process');

        exec(pkillCmd, (error, stdout, stderr) => {
          api.log(`${pkillCmd} is issued`, 'native.process');

          if (error !== null) {
            api.log(`${pkillCmd} exec error: ${error}`, 'native.process');
          };
        });
      }

      if (error !== null) {
        api.log(`${processGrep} exec error: ${error}`, 'native.process');
      };
    });
  }

  api.isDaemonRunning = (daemonName) => {
    return new Promise((resolve, reject) => {
      let platform = os.platform();
      let cmd = '';
      switch (platform) {
          case 'win32' : cmd = `tasklist`; break;
          case 'darwin' : cmd = `ps -ax | grep ${daemonName}`; break;
          case 'linux' : cmd = `ps -A`; break;
          default: break;
      }

      exec(cmd, (err, stdout, stderr) => {
        if (platform === 'darwin') {
          resolve(stdout.toLowerCase().indexOf(`assets/bin/osx/${daemonName}`) > -1)
        } else {
          resolve(stdout.toLowerCase().indexOf(daemonName.toLowerCase()) > -1)
        }
      });
    })      
  }

  api.isAnyDaemonRunning = async () => {
    for (const daemon of DAEMON_NAMES) {
      if (await api.isDaemonRunning(daemon)) {
        api.log(`${daemon} is currently running...`, 'native.process');
        return true;
      } else {
        api.log(`${daemon} is not currently running...`, 'native.process');
      }
    }    
  }

  return api;
};