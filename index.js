const is = require('is-type-of');
const schedule = require('node-schedule');

module.exports = class Schedule {
  constructor(app) {
    this.app = app;
    this.status = 0;

    app.ready( () => {
      if (!this.rule) throw new Error('请先设置任务时间规则');
      if (!this.task) throw new Error('请先设置任务逻辑函数');
      this.schedule = schedule.scheduleJob(this.rule(), this._handler(this.task.bind(this)));
    })
  }
  
  _handler(fn) {
    return () => {
      this.status = 1;
      if (is.asyncFunction(fn)) {
        fn().then(() => this.status = 0).catch(e => {
          this.status = 0;
          this.app.logger.error(e);
        });
      } else {
        try{
          fn();
          this.status = 0;
        } catch (e) {
          this.status = 0;
          this.app.logger.error(e);
        }
      }
    }
  }
  
  async cancel() {
    if (this.schedule) {
      if (this.status === 1) {
        await new Promise(resolve => {
          const timer = setInterval(() => {
            if (this.status === 0) {
              clearInterval(timer);
              this.schedule.cancel();
              resolve();
            }
          }, 50);
        })
      } else {
        this.schedule.cancel();
      }
    }
  }
};

module.exports.RecurrenceRule = schedule.RecurrenceRule;
module.exports.Range = schedule.Range;