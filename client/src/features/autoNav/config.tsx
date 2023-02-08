const translation: Record<string, string> = {
  "": "首页",
  board: "排行榜",
  apply: "入会申请",
  auth: "审核登录",
  audit: "审核主页",
};

export const menuItem = ["", "board", "apply", "auth", "audit"];

export function getTranslation(key: string) {
  const trans = translation[key];
  if (trans === undefined) {
    return key;
  }
  return trans;
}

