export function formatAssembler(selectedPageReleases, allPageReleases) {
  let assembler = {
    entityList: [],
    pageList: [],
    resourceList: [],
    npmPackages: [],
  };
  selectedPageReleases.forEach((page) => {
    if (page.codelessType === "1" || page.codelessType === "2") {
      const pageContent = JSON.parse(page.pageContent);
      let pageConvert = convert(pageContent, page.codelessType);
      assemblerPush(assembler, pageConvert);
    }
  });

  if (allPageReleases) {
    assembler.pageList.forEach((ap) => {
      ap.childIds.forEach((apc) => {
        if (!selectedPageReleases.some((i) => i.prototypeId === apc)) {
          const childPage = allPageReleases.find((i) => i.prototypeId === apc);
          const childContent = JSON.parse(childPage.pageContent);
          let childPageConvert = convert(childContent, childContent.codelessType);
          assemblerPush(childPageConvert, childContent);
        }
      });
    });
  }
  return assembler;
}

function convert(pageContent, codelessType) {
  const pEntityAuthorities = pageContent.entityAuthorities;
  const pPageList = pageContent.pageList;
  const pResourceList = pageContent.resourceList;

  let entityAuthorities = [];
  let entityList = [];

  if (pEntityAuthorities) {
    pEntityAuthorities.forEach((e) => {
      if (entityAuthorities.some((i) => i.entityId === e.entityId)) {
        let index = entityAuthorities.findIndex(
          (i) => i.entityId === e.entityId
        );

        let operations = [
          ...entityAuthorities[index].operations,
          ...e.operations,
        ];
        entityAuthorities[index].operations = [...new Set(operations)];
      } else {
        entityAuthorities.push({
          entityId: e.entityId,
          operations: e.operations,
        });
      }

      entityList.push(e.entityId);
    });

    entityList = [...new Set(entityList)];
  }

  let pageList = {};
  if (pPageList) {
    pageList = { pageId: pPageList.pageId, childIds: [], entityAuthorities };

    pPageList.children.forEach((p) => {
      if (!pageList.childIds.some((i) => i === p.pageId)) {
        pageList.childIds.push(p.pageId);
      }
    });
  }

  let resourceList = [];
  if (pResourceList) {
    pResourceList.forEach((r) => {
      resourceList.push(r.id);
    });
    resourceList = [...new Set(resourceList)];
  }

  let npmPackages = [];

  let currentPageComponent = getCurrentPageComponentList(
    pageContent,
    codelessType
  );
  // pageList.childIds.forEach(p=> {
  //   const childPage = all.find(i=>i.prototypeId === p);
  //   const childContent = JSON.parse(childPage.pageContent);
  //   const childCodelessType = childPage.codelessType;
  //   currentPageComponent = [ ...currentPageComponent, ...getCurrentPageComponentList(childContent, childCodelessType) ];
  // })
  currentPageComponent = [...new Set(currentPageComponent)];
  currentPageComponent.map((c) => {
    npmPackages.push({
      module: "alcap-component",
      name: c,
      version: window.appearanceLibsMap[`@alcap-component/${c}`].version,
    });
  });
  // console.log('组件包', npmPackages);

  return { entityList, pageList, resourceList, npmPackages };
}

function getCurrentPageComponentList(pageContent, codelessType) {
  let componentArr = [];
  if (codelessType === "1") {
    pageContent.structure.children.forEach((c) => {
      componentArr.push(c.href);
      if (c.children) {
        componentArr = [
          ...componentArr,
          ...new Set(c.children.map((i) => i.href)),
        ];
      }
    });
    componentArr = [...new Set(componentArr)];
  } else if (codelessType === "2") {
    componentArr = [...new Set(pageContent.children.map((i) => i.href))];
  }

  return componentArr;
}

function assemblerPush(assembler, pageConvert) {
  assembler.entityList = [
    ...new Set([...assembler.entityList, ...pageConvert.entityList]),
  ];
  assembler.pageList.push(pageConvert.pageList);
  assembler.resourceList = [
    ...new Set([...assembler.resourceList, ...pageConvert.resourceList]),
  ];

  const mpMap = new Map();
  assembler.npmPackages = [
    ...assembler.npmPackages,
    ...pageConvert.npmPackages,
  ].filter((item) => !mpMap.has(item.name) && mpMap.set(item.name, 1));
}
