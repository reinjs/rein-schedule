# rein-schedule

## Install

```shell
npm i @reinjs/rein-schedule
```

## Usage

在项目文件夹或者插件文件夹中会存在一个文件夹 `schedule`，下面所有的文件都将被认为是一个任务，任务必须存在2个属性或方法：

- **rule** `object`或者`string` 时间规则 参考 https://www.npmjs.com/package/node-schedule#cron-style-scheduling
- **task** `function` 执行逻辑

比如我们创建一个任务 `app/schedule/test/db.js`:

```javascript
const Schedule = require('@reinjs/rein-schedule');

module.exports = class DbSchedule extends Schedule {
  constructor(...args) {
    super(...args);
  }

  /**
   * 此属性可以直接用字符串表示
   * 比如 `return '0 17 ? * 0,4-6'`
   */
  get rule() {
    const rule = new Schedule.RecurrenceRule();
    rule.dayOfWeek = [0, new Schedule.Range(4, 6)];
    rule.hour = 17;
    rule.minute = 0;
    return rule;
  }

  async task() {
    // this.app do something.
  }
}
```

- 获取方式 `app.schedule.test.db`，遵守`reinjs`约定都规范。
- 取消任务 `await app.schedule.test.db.cancel()`

> **注意** 此插件只允许使用在`agent`进程上

# License

It is [MIT licensed](https://opensource.org/licenses/MIT).