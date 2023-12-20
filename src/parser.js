import { existsSync, readFile, createReadStream } from 'node:fs';
import chalk from 'chalk';
import { watch } from 'chokidar';
import { EOL } from 'node:os';
import EventEmitter from 'node:events';

var Parser = class Parser extends EventEmitter {
  constructor(filePath, { debug: debug, autoUpdate: autoUpdate, test } = { test: false, debug: false, autoUpdate: null }) {
    super();
    this.filePath = filePath;
    this.debug = debug;
    this.autoUpdate = autoUpdate;
    this.watcher;
    this.autoUpdateTimerFn;
    // Start from the beginning
    this.test = test;
  }
  _isFileExist() {
    const exist = existsSync(this.filePath);
    if (!exist) {
      this._debug(`file doesn\'t exist ${this.filePath}`);
    }
    return exist;
  }
  _initCursorPosFromFile() {
    if (!this._isFileExist()) {
      this._debug(`read file aborted`);
      return this;
    }
    readFile(this.filePath, 'utf8', (err, data) => {
      this.cursorPos = this.test ? 0 : data.length;
      this._debug(`Init at pos ${this.cursorPos}`);
    });
    return this;
  }
  _initWatcher() {
      this.watcher = watch(this.filePath);
      this.watcher.on('error', error => this._debug(`Watcher error: ${error}`));
    return this;
  }
  _debug(msg, type = 'log') {
    if (this.debug) {
      console[type](chalk.red(`Parser: ${msg}`));
    }
    return this;
  }
  init() {
    this._debug('-- Initializing');
    this._initCursorPosFromFile();
    this._initWatcher();
    this._debug('-- Initialized --');
    return this;
  }
  stopAutoUpdateTimer() {
    this._debug('autoUpdate:stop');
    clearTimeout(this.autoUpdateTimerFn);
    return this;
  }
  startAutoUpdateTimer() {
    if (!!this.autoUpdate) {
      this._debug(`autoUpdate:start ${this.autoUpdate}ms`);
      readFile(this.filePath, 'utf8', (err, data) => {
        if (this.cursorPos === data.length) {
          this._debug('file change skip');
        } else {
          var from = this.cursorPos === 0 ? 0 : this.cursorPos;
          var to = this.cursorPos = data.length;
          this.readFileFromTo(from, to);
        }
        this.autoUpdateTimerFn = setTimeout(() => {
          this._debug('emit:update');
          this.emit('update');
          this.startAutoUpdateTimer();
        }, this.autoUpdate);
      });
    }
    return this;
  }
  readFileFromTo(from, to) {
    this._debug(`from ${from} to ${to}`);
    createReadStream(this.filePath, { start: from, end: to }).on('data', (chunk) => {
      var txt = chunk.toString('utf8');
      txt.split(EOL).forEach((text) => {
        this.emit('data', text);
      });
    });
    return this;
  }
  start() {
    this._debug('-- Starting');
    this.startAutoUpdateTimer();
    // --- Old way
    // this.watcher.on('change', (path, stats) => {
    //   // Nothing changed
    //   if (!stats || !stats.size || this.cursorPos === stats.size) {
    //     this._debug('file change skip');
    //     return;
    //   }
    //   var from = this.cursorPos === 0 ? 0 : this.cursorPos;
    //   var to = this.cursorPos = stats.size;
    //   this.readFileFromTo(from, to);
    // });
    this._debug('-- Started --');
    return this;
  }
  close() {
    this._debug('-- Closing');
    this.stopAutoUpdateTimer();
    this.watcher.close();
    this._debug('-- Closed --');
    return this;
  }
};

export default Parser;
