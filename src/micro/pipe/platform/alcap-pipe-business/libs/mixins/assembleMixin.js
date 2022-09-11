export const entityAuthorities = {
  inject: ["root"],
  props: {
    wid: {
      type: String,
      default: "",
    },
  },
  methods: {
    getPageContent() {
      const ctx = this;
      let p = null;
      if (
        !ctx.root.pageContent ||
        JSON.stringify(ctx.root.pageContent) === "{}"
      ) {
        if (!ctx.root.$refs.componentsRef) {
          p = ctx.root.content;
        } else {
          p = ctx.root.$refs.componentsRef.pageDef;
        }
      } else {
        p = ctx.root.pageContent;
      }
      return p;
    },
    saveEntityToPageContent(wid, entityId, operationType) {
      const ctx = this;

      if (!ctx.wid && !wid) return;
      let p = ctx.getPageContent();

      if (!p.entityAuthorities) p.entityAuthorities = [];

      wid = ctx.wid || wid;
      entityId = ctx.dataValue || entityId;

      if (p.entityAuthorities.some((i) => i.wid === wid)) {
        let findEntityIndex = p.entityAuthorities.findIndex(
          (i) => i.wid === wid
        );
        p.entityAuthorities[findEntityIndex].entityId = entityId;
        if(operationType) {
          let operations = p.entityAuthorities[findEntityIndex].operations;
          if (Array.isArray(operationType)) {
            operations = [ ...operations, ...operationType ];
          }else {
            operations.push(operationType);
          }
          p.entityAuthorities[findEntityIndex].operations = [ ...new Set(operations) ];
        }
      } else {
        p.entityAuthorities.push({
          wid: wid,
          entityId: entityId,
          operations: Array.isArray(operationType) ? operationType : [ operationType || "retrieve" ], //实体使用到的操作权限
        });
      }
      // console.log('保存的实体', p.entityAuthorities);
    },
    delEntityInPageContent(wid, isOnlyDelChild) {
      const ctx = this;
      if (!wid) return;
      
      let p = ctx.getPageContent();
      if (!p.entityAuthorities) return 

      if (!isOnlyDelChild) {
        if (!p.entityAuthorities || p.entityAuthorities.findIndex((i) => i.wid === wid) === -1) return;
        let findEntityIndex = p.entityAuthorities.findIndex((i) => i.wid === wid);
        p.entityAuthorities.splice(findEntityIndex, 1);
        console.log('删除了那个实体', wid, p.entityAuthorities);
      }
      
      const eChild = p.entityAuthorities.filter(i=>String(i.wid).indexOf(wid + '-') > -1);
      eChild.forEach(e => {
        ctx.delEntityInPageContent(e.wid);
      });
    },
  },
};

export const pageList = {
  inject: ["root"],
  props: {
    wid: {
      type: String,
      default: "",
    },
  },
  methods: {
    getPageContent() {
      const ctx = this;
      let p = null;
      if (
        !ctx.root.pageContent ||
        JSON.stringify(ctx.root.pageContent) === "{}"
      ) {
        if (!ctx.root.$refs.componentsRef) {
          p = ctx.root.content;
        } else {
          p = ctx.root.$refs.componentsRef.pageDef;
        }
      } else {
        p = ctx.root.pageContent;
      }
      return p;
    },
    savePageListToPageContent(wid, pageId) {
      const ctx = this;

      if (!ctx.wid && !wid) return;
      let p = ctx.getPageContent();
      if(!p.pageList) p.pageList = { pageId: this.pageId, children: [] };
      let pChild = p.pageList.children;

      wid = ctx.wid || wid;
      
      if (pChild.some(i=>i.wid === wid)) {
        let findPageIndex = pChild.findIndex(i=>i.wid === wid);
        pChild[findPageIndex].pageId = pageId;
      }else {
        pChild.push({
          wid,
          pageId
        })
      }


      console.log('保存的页面', pChild);
    },
    delPageInPageContent(wid) {
      const ctx = this;
      if (!wid) return;
      
      let p = ctx.getPageContent();
      if (!p.pageList) return
      let pChild = p.pageList.children;

      if (pChild.findIndex((i) => i.wid === wid) > -1) {
        let findPageIndex = pChild.findIndex((i) => i.wid === wid);
        pChild.splice(findPageIndex, 1);
      }
      const ppChild = pChild.filter(i=>String(i.wid).indexOf(wid + '-') > -1);
      ppChild.forEach(e => {
        ctx.delPageInPageContent(e.wid);
      });

      console.log('删除后的页面列表', wid, pChild);
    },
  }
}

export const resourceList = {
  inject: ["root"],
  methods: {
    getPageContent() {
      const ctx = this;
      let p = null;
      if (
        !ctx.root.pageContent ||
        JSON.stringify(ctx.root.pageContent) === "{}"
      ) {
        if (!ctx.root.$refs.componentsRef) {
          p = ctx.root.content;
        } else {
          p = ctx.root.$refs.componentsRef.pageDef;
        }
      } else {
        p = ctx.root.pageContent;
      }
      return p;
    },
    saveResourceToPageContent(resource) {
      const ctx = this;

      let p = ctx.getPageContent();
      if(!p.resourceList) p.resourceList = [];
      let pResourceList = p.resourceList;

      if (pResourceList.some(i=>i.wid === resource.wid)) {
        let findReIndex = pResourceList.findIndex(i=>i.wid === resource.wid);
        pResourceList[findReIndex].id = resource.id;
      }else {
        pResourceList.push(resource)
      }

      console.log('保存的资源', pResourceList);
    },
    delResourceInPageContent(wid) {
      const ctx = this;
      if (!wid) return;
      
      let p = ctx.getPageContent();
      if(!p.resourceList) return;
      let pResourceList = p.resourceList;

      if (pResourceList.findIndex((i) => i.wid === wid) > -1) {
        let findReIndex = pResourceList.findIndex((i) => i.wid === wid);
        pResourceList.splice(findReIndex, 1);
      }

      console.log('删除后的资源列表', wid, pResourceList);
    }
  }
}