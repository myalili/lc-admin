const dataEntityMethod = {
  create: {
    handler: (ctx, item) => {
      ctx.dialogInfo.fields = ctx.formData.forms;
      ctx.dialogInfo.opr = item;
      ctx.dialogInfo.title = "新增";
      ctx.formSubmit(ctx.searchForm);
    },
  },
  update: {
    handler: (ctx, item) => {
      ctx.dialogInfo.fields = ctx.formData.forms;
      ctx.dialogInfo.opr = item;
      ctx.dialogInfo.title = "修改";
      ctx.formSubmit(ctx.searchForm);
    },
  },
  retrieve: {
    handler: (ctx, item) => {},
  },
  delete: {
    handler: (ctx, item) => {},
  },
  export: {
    handler: (ctx, item) => {},
  },
  import: {
    handler: (ctx, item) => {},
  },
};

const api = {};

const publicMethod = {
  open: {
    handler: (ctx, item) => {
      ctx.replace(item);
    },
  },
  "open:sub": {
    handler: (ctx, item) => {
      ctx.replace(item, "SUB");
    },
  },
  close: {
    handler: (ctx, item) => {
      ctx.$root.cancel();
    },
  },
  "confirm:pageData": {
    handler: async (ctx, item) => {
      let valid = await ctx.$refs.ruleForm.validate();
      if (valid) {
        item.cascaderRun = false;

        console.log(ctx.root.pageContent.args, '页面变量');

        console.log(item);
        
        

        let res = await pipe.entity.getEntityDetail(item.entityId);
        console.log(res);

        let form = ctx.root.pageContent.args[res.name];

        for (const key in form) {
          if (typeof form[key] === 'object') {
            form = { ...form, ...form[key] };
            delete form[key]
          }
        }

        console.log('参数', form);

        let operationType = "create";
        let params = {
          entityId: res.id,
          fields: [],
        };
  
        for (const key in form) {
          res.fields.forEach((i) => {
            if (i.dictionaryItem.engNameShort === key) {
              params.fields.push({
                entityFieldId: i.id,
                value: form[key],
              });
            }
          });
        }

        pipe.entity
        .getEntityData(res.id, 'createRecord', params)
        .then((res) => { 
          console.log('res', res);
          if ( res=== "success") {
            ctx.$notify({
              message: "启动成功！",
              title: "成功",
              type: "success",
            });
            item.cascaderRun = true;
          } else {
            ctx.$notify.error({
              title: "错误",
              message: '错误',
            });
            item.cascaderRun = false;
          }
        })
      }
    }
  },
  confirm: {
    handler: (ctx, item) => {
      ctx.$refs.ruleForm.validate((valid) => {
        console.log("表单内容", ctx.searchForm);
        if (valid) {
          ctx.dialogInfo.fields = ctx.formData.forms;
          ctx.dialogInfo.opr = item;
          if (!ctx.formData.entityId) {
            return;
          }
          item.cascaderRun = true;
          ctx.formSubmit(ctx.searchForm);
        } else {
          item.cascaderRun = false;
        }
      });
    },
  },
  "confirm:process": {
    handler: async (ctx, item) => {
      let valid = await ctx.$refs.ruleForm.validate();
      console.log("表单内容", ctx.searchForm);
      if (valid) {
        item.cascaderRun = false;
        let variables = [];
        for (const key in ctx.searchForm) {
          variables.push({
            name: key,
            value: ctx.searchForm[key],
          });
        }
        const data = {
          processDefinitionKey:
            (ctx.AParams && ctx.AParams.processDefinitionKey) || "",
          // customVersion: '0.0.3',
          // processDefinitionId: "34a01fc5-aff5-11ec-aac2-0242e58fb1f7:0.0.3",
          variables,
        };
        let startProcessInstances = await activator
          .get("alcap.aopsUtilApi")
          .startProcessInstances.handler(data);
        console.log(startProcessInstances);
        if (startProcessInstances.msg === "success") {
          ctx.$notify({
            message: "启动成功！",
            title: "成功",
            type: "success",
          });
          item.cascaderRun = true;
        } else {
          ctx.$notify.error({
            title: "错误",
            message: startProcessInstances.msg,
          });
          item.cascaderRun = false;
        }
      } else {
        item.cascaderRun = false;
      }
    },
  },
  templet: {
    handler: (ctx, item) => {
      console.log(item);
      console.log(ctx.searchForm);
      let form = { ...ctx.searchForm };
      ctx.formSubmit(form, item.entityId, "保存", true);
    },
  },
  showFormContent: {
    handler: async (ctx, item) => {
      let valid = await ctx.$refs.ruleForm.validate();
      console.log("表单内容", ctx.searchForm);
      if (valid) {
        ctx.showFormContent = !ctx.showFormContent;
        item.cascaderRun = true;
      } else {
        item.cascaderRun = false;
      }
    },
  },
  reset: {
    handler(ctx, item) {
      ctx.$refs.ruleForm.resetFields();
    },
  },
};

export async function oprClick(ctx, item) {
  const oprMap = new Map([
    ["dataEntityMethod", [item.opr.operationType, dataEntityMethod]],
    ["api", ["", api]],
    ["publicMethod", [item.opr.id, publicMethod]],
  ]);
  const returnOpr = oprMap.get(item.type.value);

  if (item.hasConfirm) {
    const imgSrc = process.env.BASE_URL + item.confirmImg || "";

    ctx.openCustomDialog({
      title: "提示",
      path: "deleteConfirm",
      width: "300px",
      component: {
        template: `<div><img src="/img${imgSrc}"><p class="text-center mt-2">${item.confirmText}</p></div>`,
      },
      async confirmCallback() {
        await returnOpr[1][returnOpr[0]].handler(ctx, item);
      },
    });
  } else {
    await returnOpr[1][returnOpr[0]].handler(ctx, item);
  }
}
