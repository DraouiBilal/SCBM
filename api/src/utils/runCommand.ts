import {exec} from 'child_process';

export const runCommand = (command: string) => {
    return new Promise<string>((resolve, reject) => {
        const child = exec(command, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                resolve(stdout);
            }
        });
    });
}