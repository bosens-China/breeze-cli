import shell from 'shelljs';

export const isYarn = () => !!shell.which('yarn');
