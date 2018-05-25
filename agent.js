const path = require('path');
const is = require('is-type-of');
const Loader = require('@reinjs/rein-loader/lib/renderer');
module.exports = async app => {
  app.schedules = [];
  app.schedule = {};
  
  app.loader.addCompiler('schedule', dirs => {
    const directory = dirs.map(dir => path.resolve(dir.pathname, 'app/schedule'));
    const _options = Object.assign({
      match: ['**/*.js'],
      directory,
      inject: app,
      call: false,
      target: app.schedule,
      initializer: scheduleInitializer
    });
    new Loader(_options).load();
  });
  
  app.destroyed(async () => await Promise.all(app.schedules.map(schedule => schedule.cancel())));
  
  function scheduleInitializer(obj, opt) {
    if (!is.class(obj)) throw new Error('schedule必须是一个class模块');
    obj.prototype.pathName = opt.pathName;
    obj.prototype.fullPath = opt.path;
    const target = new obj(app);
    app.schedules.push(target);
    return target;
  }
};