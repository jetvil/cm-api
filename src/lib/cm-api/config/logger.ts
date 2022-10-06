/* eslint-disable no-console */
export const logger = {
  log: (message: string, verbose: boolean) => {
    if (verbose) {
      console.log(message);
    }
  },
  error: (error: any, verbose: boolean) => {
    console.error(verbose ? error : error.message);
  },
  info: (message: string, verbose: boolean) => {
    if (verbose) {
      console.info(message);
    }
  },
};
