const path = require('path');
module.exports = class Commander {
  constructor(ctx) {
    this.ctx = ctx;
  }
  
  async add(name, data) {
    if (data.schedule) {
      let file;
      const ctx = this.ctx;
      const bname = name.replace(/[\-\.]+/, '_');
      const cname = ctx.utils.cname(bname, 'schedule');
      const relativePath = path.relative(ctx.projectCwd, process.cwd());
      if (!relativePath) {
        file = path.resolve(ctx.projectCwd, 'app', 'schedule', binkJsExt(name));
      } else {
        const isInSchedule = relativePath.indexOf('app/schedule') === 0;
        if (isInSchedule) {
          file = path.resolve(process.cwd(), name, binkJsExt(name));
        } else {
          file = path.resolve(ctx.projectCwd, 'app', 'schedule', binkJsExt(name));
        }
      }
      ctx.spinner.start();
      ctx.spinner.name = 'cache';
      ctx.spinner.info('正在生成文件...');
      await ctx.utils.createFiles(ctx, [{
        file, cname,
        template: path.resolve(__dirname, '.template.ejs')
      }]);
      ctx.spinner.success('全部文件生成完毕');
      return true;
    }
  }
};

function binkJsExt(name) {
  if (/\.js$/i.test(name)) return name;
  return name + '.js';
}